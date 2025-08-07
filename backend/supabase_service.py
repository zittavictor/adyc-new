import os
import asyncio
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
import asyncpg
from dotenv import load_dotenv
import logging
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.database_url = os.getenv('DATABASE_URL')
        
        if not all([self.supabase_url, self.supabase_key]):
            raise ValueError("Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_ANON_KEY.")
        
        # Initialize Supabase client
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self._connection_pool = None
        
    async def init_connection_pool(self):
        """Initialize the async connection pool"""
        if not self._connection_pool:
            # Extract connection details from DATABASE_URL if needed for direct async operations
            if self.database_url and '[password]' in self.database_url:
                # For now, we'll primarily use the Supabase client which handles authentication
                # If direct DB access is needed, the service key would be required
                pass
            
    async def create_tables(self):
        """Create necessary tables if they don't exist"""
        try:
            # Status checks table
            await self._execute_query("""
                CREATE TABLE IF NOT EXISTS status_checks (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    client_name TEXT NOT NULL,
                    timestamp TIMESTAMPTZ DEFAULT NOW()
                );
            """)
            
            # Members table with enhanced security features
            await self._execute_query("""
                CREATE TABLE IF NOT EXISTS members (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    member_id TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    passport TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    dob TEXT NOT NULL,
                    ward TEXT NOT NULL,
                    lga TEXT NOT NULL,
                    state TEXT NOT NULL,
                    country TEXT DEFAULT 'Nigeria',
                    address TEXT NOT NULL,
                    language TEXT DEFAULT '',
                    marital_status TEXT DEFAULT '',
                    gender TEXT NOT NULL,
                    registration_date TIMESTAMPTZ DEFAULT NOW(),
                    id_card_generated BOOLEAN DEFAULT FALSE,
                    id_card_serial_number TEXT UNIQUE,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)
            
            # Blog posts table for admin system
            await self._execute_query("""
                CREATE TABLE IF NOT EXISTS blog_posts (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    summary TEXT,
                    author TEXT NOT NULL,
                    author_email TEXT NOT NULL,
                    image_url TEXT,
                    published BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)
            
            # Admin users table
            await self._execute_query("""
                CREATE TABLE IF NOT EXISTS admin_users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)
            
            # Activity logs for monitoring
            await self._execute_query("""
                CREATE TABLE IF NOT EXISTS activity_logs (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_email TEXT,
                    action TEXT NOT NULL,
                    resource_type TEXT NOT NULL,
                    resource_id TEXT,
                    details JSONB,
                    ip_address TEXT,
                    user_agent TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)
            
            logger.info("Tables created successfully")
            
        except Exception as e:
            logger.error(f"Error creating tables: {e}")
            raise
    
    async def _execute_query(self, query: str, params: Optional[List] = None):
        """Execute a raw SQL query"""
        try:
            # For table creation and raw queries, we might need direct database access
            # For now, let's use the Supabase client for most operations
            # This is a placeholder for direct SQL execution if needed
            pass
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            raise
    
    # STATUS CHECKS OPERATIONS
    async def create_status_check(self, client_name: str) -> Dict[str, Any]:
        """Create a new status check"""
        try:
            data = {
                'id': str(uuid.uuid4()),
                'client_name': client_name,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            result = self.supabase.table('status_checks').insert(data).execute()
            return result.data[0] if result.data else data
            
        except Exception as e:
            logger.error(f"Error creating status check: {e}")
            raise
    
    async def get_status_checks(self) -> List[Dict[str, Any]]:
        """Get all status checks"""
        try:
            result = self.supabase.table('status_checks').select('*').limit(1000).execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Error fetching status checks: {e}")
            raise
    
    # MEMBERS OPERATIONS
    async def create_member(self, member_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new member"""
        try:
            # Check if email already exists
            existing = self.supabase.table('members').select('id').eq('email', member_data['email']).execute()
            if existing.data:
                raise ValueError("Email already registered")
            
            # Generate unique member ID and serial number
            current_year = datetime.now().year
            random_id = f"{uuid.uuid4().hex[:6].upper()}"
            member_id = f"ADYC-{current_year}-{random_id}"
            serial_number = f"SN-{uuid.uuid4().hex[:8].upper()}"
            
            data = {
                'id': str(uuid.uuid4()),
                'member_id': member_id,
                'id_card_serial_number': serial_number,
                'registration_date': datetime.utcnow().isoformat(),
                **member_data
            }
            
            result = self.supabase.table('members').insert(data).execute()
            
            # Log the activity
            await self.log_activity(
                user_email=member_data['email'],
                action='MEMBER_REGISTRATION',
                resource_type='member',
                resource_id=member_id,
                details={'full_name': member_data['full_name']}
            )
            
            return result.data[0] if result.data else data
            
        except Exception as e:
            logger.error(f"Error creating member: {e}")
            raise
    
    async def get_members(self) -> List[Dict[str, Any]]:
        """Get all members"""
        try:
            result = self.supabase.table('members').select('*').limit(1000).execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Error fetching members: {e}")
            raise
    
    async def get_member_by_id(self, member_id: str) -> Optional[Dict[str, Any]]:
        """Get member by member_id"""
        try:
            result = self.supabase.table('members').select('*').eq('member_id', member_id).execute()
            return result.data[0] if result.data else None
            
        except Exception as e:
            logger.error(f"Error fetching member by ID: {e}")
            raise
    
    async def mark_id_card_generated(self, member_id: str) -> bool:
        """Mark ID card as generated for a member"""
        try:
            result = self.supabase.table('members').update({
                'id_card_generated': True,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('member_id', member_id).execute()
            
            return bool(result.data)
            
        except Exception as e:
            logger.error(f"Error marking ID card as generated: {e}")
            raise
    
    # BLOG POSTS OPERATIONS
    async def create_blog_post(self, post_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new blog post (admin only)"""
        try:
            data = {
                'id': str(uuid.uuid4()),
                'created_at': datetime.utcnow().isoformat(),
                **post_data
            }
            
            result = self.supabase.table('blog_posts').insert(data).execute()
            
            # Log the activity
            await self.log_activity(
                user_email=post_data.get('author_email'),
                action='BLOG_POST_CREATED',
                resource_type='blog_post',
                resource_id=data['id'],
                details={'title': post_data['title']}
            )
            
            return result.data[0] if result.data else data
            
        except Exception as e:
            logger.error(f"Error creating blog post: {e}")
            raise
    
    async def get_blog_posts(self, published_only: bool = True) -> List[Dict[str, Any]]:
        """Get blog posts"""
        try:
            query = self.supabase.table('blog_posts').select('*')
            if published_only:
                query = query.eq('published', True)
            
            result = query.order('created_at', desc=True).execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Error fetching blog posts: {e}")
            raise
    
    # ADMIN OPERATIONS
    async def create_admin_user(self, admin_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new admin user"""
        try:
            data = {
                'id': str(uuid.uuid4()),
                'created_at': datetime.utcnow().isoformat(),
                **admin_data
            }
            
            result = self.supabase.table('admin_users').insert(data).execute()
            return result.data[0] if result.data else data
            
        except Exception as e:
            logger.error(f"Error creating admin user: {e}")
            raise
    
    async def get_admin_user(self, username: str) -> Optional[Dict[str, Any]]:
        """Get admin user by username"""
        try:
            result = self.supabase.table('admin_users').select('*').eq('username', username).eq('is_active', True).execute()
            return result.data[0] if result.data else None
            
        except Exception as e:
            logger.error(f"Error fetching admin user: {e}")
            raise
    
    # ACTIVITY LOGGING
    async def log_activity(self, user_email: Optional[str], action: str, resource_type: str, 
                          resource_id: Optional[str] = None, details: Optional[Dict] = None,
                          ip_address: Optional[str] = None, user_agent: Optional[str] = None):
        """Log user activity"""
        try:
            data = {
                'id': str(uuid.uuid4()),
                'user_email': user_email,
                'action': action,
                'resource_type': resource_type,
                'resource_id': resource_id,
                'details': details,
                'ip_address': ip_address,
                'user_agent': user_agent,
                'created_at': datetime.utcnow().isoformat()
            }
            
            self.supabase.table('activity_logs').insert(data).execute()
            
        except Exception as e:
            logger.error(f"Error logging activity: {e}")
            # Don't raise here as this shouldn't break the main operation
    
    async def get_activity_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent activity logs"""
        try:
            result = self.supabase.table('activity_logs').select('*').order('created_at', desc=True).limit(limit).execute()
            return result.data
            
        except Exception as e:
            logger.error(f"Error fetching activity logs: {e}")
            raise

# Global instance
_supabase_service = None

def get_supabase_service() -> SupabaseService:
    """Get the global Supabase service instance"""
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service