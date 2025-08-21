from fastapi import FastAPI, APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from email_service import get_email_service
from supabase_service import get_supabase_service
from cloudinary_service import get_cloudinary_service
from sanity_service import get_sanity_service
from qr_service import get_qr_service
import jwt
from passlib.context import CryptContext


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_service = get_supabase_service()

# Initialize other services
cloudinary_service = get_cloudinary_service()
sanity_service = get_sanity_service()
qr_service = get_qr_service()

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "adyc-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Member Registration Models
class MemberRegistration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    member_id: str
    email: EmailStr
    passport: str  # base64 encoded image
    full_name: str
    dob: str
    ward: str
    lga: str
    state: str
    country: str = "Nigeria"
    address: str
    language: str = ""
    marital_status: str = ""
    gender: str
    registration_date: datetime = Field(default_factory=datetime.utcnow)

class MemberRegistrationCreate(BaseModel):
    email: EmailStr
    passport: str  # base64 encoded image
    full_name: str
    dob: str
    ward: str
    lga: str
    state: str
    country: str = "Nigeria"
    address: str
    language: str = ""
    marital_status: str = ""
    gender: str

# Admin Authentication Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    id: str
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

# Blog Post Models
class BlogPost(BaseModel):
    id: str
    title: str
    content: str
    summary: Optional[str] = None
    author: str
    author_email: EmailStr
    image_url: Optional[str] = None
    published: bool = False
    created_at: datetime
    updated_at: datetime

class BlogPostCreate(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    image_url: Optional[str] = None
    published: bool = False

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    image_url: Optional[str] = None
    published: Optional[bool] = None

# Security Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated admin user"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    admin_user = await supabase_service.get_admin_user(username)
    if admin_user is None:
        raise HTTPException(status_code=401, detail="Admin user not found")
    
    return admin_user

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    result = await supabase_service.create_status_check(status_obj.client_name)
    return StatusCheck(**result)

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await supabase_service.get_status_checks()
    return [StatusCheck(**status_check) for status_check in status_checks]

# Member Registration Endpoints
@api_router.post("/register", response_model=MemberRegistration)
async def register_member(input: MemberRegistrationCreate, background_tasks: BackgroundTasks):
    member_dict = input.dict()
    
    try:
        # Create member using Supabase service (it handles member_id generation and email checking)
        result = await supabase_service.create_member(member_dict)
        member_obj = MemberRegistration(**result)
        
        # Send registration email with ID card PDF in background
        background_tasks.add_task(get_email_service().send_registration_email, result)
        
        # Send admin notification email in background
        background_tasks.add_task(get_email_service().send_admin_notification_email, result)
        
        return member_obj
        
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/members", response_model=List[MemberRegistration])
async def get_members():
    members = await supabase_service.get_members()
    return [MemberRegistration(**member) for member in members]

@api_router.get("/members/{member_id}", response_model=MemberRegistration)
async def get_member(member_id: str):
    member = await supabase_service.get_member_by_id(member_id)
    if not member:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Member not found")
    return MemberRegistration(**member)

@api_router.get("/members/{member_id}/id-card")
async def download_id_card(member_id: str):
    """Download ID card PDF for a specific member (one-time generation)"""
    from fastapi.responses import Response
    from fastapi import HTTPException
    
    member = await supabase_service.get_member_by_id(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    try:
        # Check if ID card has already been generated
        if member.get('id_card_generated', False):
            raise HTTPException(status_code=400, detail="ID card has already been generated for this member. Each member can only generate their ID card once for security purposes.")
        
        # Generate PDF
        pdf_data = get_email_service().generate_id_card_pdf(member)
        
        # Mark ID card as generated to prevent future generations
        await supabase_service.mark_id_card_generated(member_id)
        
        # Log the activity
        await supabase_service.log_activity(
            user_email=member.get('email'),
            action='ID_CARD_GENERATED',
            resource_type='id_card',
            resource_id=member_id,
            details={'serial_number': member.get('id_card_serial_number')}
        )
        
        # Return PDF as response
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=ADYC_ID_Card_{member_id}.pdf"}
        )
    except HTTPException:
        # Re-raise HTTPExceptions (like the 400 error above)
        raise
    except Exception as e:
        logger.error(f"Error generating ID card: {e}")
        raise HTTPException(status_code=500, detail="Error generating ID card")

@api_router.post("/send-test-email")
async def send_test_email(member_id: str):
    """Send test registration email for a specific member"""
    member = await supabase_service.get_member_by_id(member_id)
    if not member:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Member not found")
    
    try:
        success = get_email_service().send_registration_email(member)
        if success:
            return {"message": "Test email sent successfully", "member_id": member_id}
        else:
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Error sending test email: {e}")
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Error sending test email")

@api_router.post("/send-admin-notification")
async def send_admin_notification(member_id: str):
    """Send test admin notification email for a specific member"""
    member = await supabase_service.get_member_by_id(member_id)
    if not member:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Member not found")
    
    try:
        success = get_email_service().send_admin_notification_email(member)
        if success:
            return {"message": "Admin notification email sent successfully", "member_id": member_id}
        else:
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail="Failed to send admin notification email")
    except Exception as e:
        logger.error(f"Error sending admin notification email: {e}")
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Error sending admin notification email")

# ADMIN AUTHENTICATION ENDPOINTS
@api_router.post("/admin/login", response_model=Token)
async def admin_login(login_data: AdminLogin):
    """Admin login endpoint"""
    admin_user = await supabase_service.get_admin_user(login_data.username)
    if not admin_user or not verify_password(login_data.password, admin_user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin_user['username']}, expires_delta=access_token_expires
    )
    
    # Log admin login
    await supabase_service.log_activity(
        user_email=admin_user['email'],
        action='ADMIN_LOGIN',
        resource_type='admin',
        resource_id=admin_user['id'],
        details={'username': admin_user['username']}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/admin/me", response_model=AdminUser)
async def get_admin_me(current_admin: dict = Depends(get_current_admin_user)):
    """Get current admin user info"""
    return AdminUser(**current_admin)

# BLOG POST ENDPOINTS
@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_blog_posts(published_only: bool = True):
    """Get blog posts (public endpoint)"""
    posts = await supabase_service.get_blog_posts(published_only)
    return [BlogPost(**post) for post in posts]

@api_router.post("/admin/blog/posts", response_model=BlogPost)
async def create_blog_post(
    post_data: BlogPostCreate, 
    current_admin: dict = Depends(get_current_admin_user)
):
    """Create a new blog post (admin only)"""
    post_dict = post_data.dict()
    post_dict['author'] = current_admin['username']
    post_dict['author_email'] = current_admin['email']
    
    result = await supabase_service.create_blog_post(post_dict)
    return BlogPost(**result)

@api_router.get("/admin/blog/posts", response_model=List[BlogPost])
async def get_admin_blog_posts(current_admin: dict = Depends(get_current_admin_user)):
    """Get all blog posts including drafts (admin only)"""
    posts = await supabase_service.get_blog_posts(published_only=False)
    return [BlogPost(**post) for post in posts]

@api_router.put("/admin/blog/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(
    post_id: str, 
    post_data: BlogPostUpdate,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Update a blog post (admin only)"""
    result = await supabase_service.update_blog_post(post_id, post_data.dict(exclude_unset=True))
    if not result:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**result)

@api_router.delete("/admin/blog/posts/{post_id}")
async def delete_blog_post(
    post_id: str, 
    current_admin: dict = Depends(get_current_admin_user)
):
    """Delete a blog post (admin only)"""
    success = await supabase_service.delete_blog_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

# ADMIN DASHBOARD ENDPOINTS
@api_router.get("/admin/dashboard/stats")
async def get_dashboard_stats(current_admin: dict = Depends(get_current_admin_user)):
    """Get dashboard statistics (admin only)"""
    stats = await supabase_service.get_dashboard_stats()
    return stats

@api_router.get("/admin/activity/logs")
async def get_activity_logs(
    limit: int = 50,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Get recent activity logs (admin only)"""
    logs = await supabase_service.get_activity_logs(limit)
    return logs

# ADMIN SETUP ENDPOINT (for initial admin creation)
@api_router.post("/setup/admin")
async def setup_admin(username: str, email: EmailStr, password: str, setup_key: str):
    """Setup initial admin user (requires setup key)"""
    # Simple setup key check (you can make this more secure)
    if setup_key != "adyc-setup-2025-secure":
        raise HTTPException(status_code=403, detail="Invalid setup key")
    
    # Check if admin already exists
    existing_admin = await supabase_service.get_admin_user(username)
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin user already exists")
    
    # Create admin user
    admin_data = {
        'username': username,
        'email': email,
        'password_hash': get_password_hash(password),
        'is_active': True
    }
    
    result = await supabase_service.create_admin_user(admin_data)
    return {"message": "Admin user created successfully", "username": username}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Supabase tables on startup
@app.on_event("startup")
async def startup_event():
    await supabase_service.create_tables()