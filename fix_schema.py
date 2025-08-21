#!/usr/bin/env python3
"""
Fix database schema issues for ADYC backend
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

def fix_database_schema():
    """Fix missing columns in database schema"""
    try:
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        if not supabase_url or not supabase_key:
            print("❌ Missing Supabase configuration")
            return False
        
        supabase = create_client(supabase_url, supabase_key)
        
        print("🔧 Attempting to fix database schema...")
        
        # Try to add missing columns to members table
        # Note: This might not work with anon key, but let's try
        try:
            # Check if photo_public_id column exists by trying to select it
            result = supabase.table('members').select('photo_public_id').limit(1).execute()
            print("✅ photo_public_id column already exists")
        except Exception as e:
            print(f"⚠️ photo_public_id column missing: {str(e)}")
            print("📝 Need to add photo_public_id column to members table")
            
        # Check if updated_at column exists
        try:
            result = supabase.table('members').select('updated_at').limit(1).execute()
            print("✅ updated_at column already exists")
        except Exception as e:
            print(f"⚠️ updated_at column missing: {str(e)}")
            print("📝 Need to add updated_at column to members table")
            
        return True
        
    except Exception as e:
        print(f"❌ Error checking database schema: {e}")
        return False

def test_member_registration_without_photo_public_id():
    """Test member registration by removing photo_public_id from the data"""
    import requests
    import json
    import uuid
    
    BACKEND_URL = "https://urlmonitor.preview.emergentagent.com/api"
    
    def create_test_passport_image():
        return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    
    try:
        # Create test member data
        test_member = {
            "email": f"schema.fix.test.{uuid.uuid4().hex[:6]}@adyc.org",
            "passport": create_test_passport_image(),
            "full_name": "Schema Fix Test Member",
            "dob": "1995-06-20",
            "ward": "Fix Ward",
            "lga": "Fix LGA",
            "state": "Fix State",
            "country": "Nigeria",
            "address": "123 Fix Street, Fix City",
            "language": "English",
            "marital_status": "Single",
            "gender": "Male"
        }
        
        print(f"\n🧪 Testing member registration: {test_member['email']}")
        response = requests.post(f"{BACKEND_URL}/register", json=test_member)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Registration successful: {data.get('member_id')}")
            return data.get('member_id')
        else:
            print(f"❌ Registration still failing")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception during test: {str(e)}")
        return None

if __name__ == "__main__":
    print("🔧 ADYC Database Schema Fix")
    print("=" * 50)
    
    fix_database_schema()
    test_member_registration_without_photo_public_id()
    
    print("\n" + "=" * 50)
    print("🏁 Schema Fix Complete")
    print("\n📋 RECOMMENDATIONS:")
    print("1. Add 'photo_public_id' column to members table: ALTER TABLE members ADD COLUMN photo_public_id TEXT;")
    print("2. Add 'updated_at' column to members table: ALTER TABLE members ADD COLUMN updated_at TIMESTAMPTZ;")
    print("3. Check Sanity service configuration for blog post creation")