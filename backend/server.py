from fastapi import FastAPI, APIRouter, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List
import uuid
from datetime import datetime
from email_service import get_email_service


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Member Registration Endpoints
@api_router.post("/register", response_model=MemberRegistration)
async def register_member(input: MemberRegistrationCreate, background_tasks: BackgroundTasks):
    # Generate member ID in format ADYC-YYYY-XXXXXX
    current_year = datetime.now().year
    random_id = f"{uuid.uuid4().hex[:6].upper()}"
    member_id = f"ADYC-{current_year}-{random_id}"
    
    member_dict = input.dict()
    member_obj = MemberRegistration(member_id=member_id, **member_dict)
    
    # Check if email already exists
    existing_member = await db.members.find_one({"email": input.email})
    if existing_member:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Insert into database
    await db.members.insert_one(member_obj.dict())
    
    # Send registration email with ID card PDF in background
    background_tasks.add_task(get_email_service().send_registration_email, member_obj.dict())
    
    # Send admin notification email in background
    background_tasks.add_task(get_email_service().send_admin_notification_email, member_obj.dict())
    
    return member_obj

@api_router.get("/members", response_model=List[MemberRegistration])
async def get_members():
    members = await db.members.find().to_list(1000)
    return [MemberRegistration(**member) for member in members]

@api_router.get("/members/{member_id}", response_model=MemberRegistration)
async def get_member(member_id: str):
    member = await db.members.find_one({"member_id": member_id})
    if not member:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Member not found")
    return MemberRegistration(**member)

@api_router.get("/members/{member_id}/id-card")
async def download_id_card(member_id: str):
    """Download ID card PDF for a specific member"""
    from fastapi.responses import Response
    
    member = await db.members.find_one({"member_id": member_id})
    if not member:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Member not found")
    
    try:
        # Generate PDF
        pdf_data = get_email_service().generate_id_card_pdf(member)
        
        # Return PDF as response
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=ADYC_ID_Card_{member_id}.pdf"}
        )
    except Exception as e:
        logger.error(f"Error generating ID card: {e}")
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Error generating ID card")

@api_router.post("/send-test-email")
async def send_test_email(member_id: str):
    """Send test registration email for a specific member"""
    member = await db.members.find_one({"member_id": member_id})
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
    member = await db.members.find_one({"member_id": member_id})
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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()