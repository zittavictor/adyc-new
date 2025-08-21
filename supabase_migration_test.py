#!/usr/bin/env python3
"""
Supabase Migration Testing for ADYC Platform
Tests the basic functionality after migrating from MongoDB to Supabase.
"""

import requests
import json
import base64
import uuid
from datetime import datetime

# Configuration
BACKEND_URL = "https://bugtracker-5.preview.emergentagent.com/api"

def create_test_passport_image():
    """Create a simple base64 encoded test image"""
    # Simple 1x1 pixel PNG in base64
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

def test_basic_api_connectivity():
    """Test basic API connectivity - GET /api/ endpoint"""
    print("\n=== Testing Basic API Connectivity ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"GET /api/ - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Basic API connectivity working")
                return True
            else:
                print(f"❌ Unexpected response: {data}")
                return False
        else:
            print(f"❌ Basic API connectivity failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Basic API connectivity error: {str(e)}")
        return False

def test_supabase_connection():
    """Test Supabase connection by checking table access"""
    print("\n=== Testing Supabase Connection ===")
    
    try:
        # Test if we can access any Supabase table - start with members
        response = requests.get(f"{BACKEND_URL}/members")
        print(f"GET /api/members - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Supabase connection working - members table accessible")
            print(f"✅ Found {len(data)} members in database")
            return True
        elif response.status_code == 500:
            print("❌ Supabase connection issue - likely missing tables")
            print("ℹ️ Tables need to be created in Supabase dashboard:")
            print("   - status_checks")
            print("   - members") 
            print("   - blog_posts")
            print("   - admin_users")
            print("   - activity_logs")
            return False
        else:
            print(f"❌ Unexpected response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Supabase connection test error: {str(e)}")
        return False

def test_status_endpoints():
    """Test status endpoints for Supabase integration"""
    print("\n=== Testing Status Endpoints ===")
    
    try:
        # Test GET /api/status
        response = requests.get(f"{BACKEND_URL}/status")
        print(f"GET /api/status - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Status GET endpoint working - returned {len(data)} status checks")
            else:
                print(f"❌ Status GET endpoint returned unexpected format: {type(data)}")
        elif response.status_code == 500:
            print("❌ Status GET endpoint failed - likely missing status_checks table")
        else:
            print(f"❌ Status GET endpoint failed: {response.text}")
            
        # Test POST /api/status
        test_data = {"client_name": "ADYC Supabase Test Client"}
        response = requests.post(f"{BACKEND_URL}/status", json=test_data)
        print(f"POST /api/status - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "client_name" in data and "timestamp" in data:
                print("✅ Status POST endpoint working")
                print(f"✅ Created status check with ID: {data['id']}")
            else:
                print(f"❌ Status POST response missing fields: {data}")
        elif response.status_code == 500:
            print("❌ Status POST endpoint failed - likely missing status_checks table")
        else:
            print(f"❌ Status POST endpoint failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Status endpoints error: {str(e)}")

def test_member_operations():
    """Test member operations with Supabase"""
    print("\n=== Testing Member Operations ===")
    
    try:
        # Test GET /api/members (should return empty array if no data)
        response = requests.get(f"{BACKEND_URL}/members")
        print(f"GET /api/members - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Members GET endpoint working - returned {len(data)} members")
                if len(data) == 0:
                    print("✅ Empty array returned as expected for new database")
                else:
                    print(f"✅ Found existing members: {[m.get('full_name', 'Unknown') for m in data[:3]]}")
                return True
            else:
                print(f"❌ Members GET endpoint returned unexpected format: {type(data)}")
                return False
        elif response.status_code == 500:
            print("❌ Members GET endpoint failed - likely missing members table")
            return False
        else:
            print(f"❌ Members GET endpoint failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Member operations error: {str(e)}")
        return False

def test_member_registration():
    """Test member registration with Supabase"""
    print("\n=== Testing Member Registration ===")
    
    try:
        # Create test member data
        test_member = {
            "email": f"supabase.test.{uuid.uuid4().hex[:6]}@adyc.org",
            "passport": create_test_passport_image(),
            "full_name": "Supabase Test User",
            "dob": "1995-06-15",
            "ward": "Test Ward",
            "lga": "Test LGA",
            "state": "Test State",
            "country": "Nigeria",
            "address": "123 Supabase Test Street",
            "language": "English",
            "marital_status": "Single",
            "gender": "Male"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=test_member)
        print(f"POST /api/register - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Member registration successful with Supabase")
            
            # Verify member ID format (ADYC-YYYY-XXXXXX)
            member_id = data.get("member_id", "")
            current_year = datetime.now().year
            if member_id.startswith(f"ADYC-{current_year}-"):
                print(f"✅ Member ID format correct: {member_id}")
            else:
                print(f"❌ Member ID format incorrect: {member_id}")
            
            # Verify all fields are present
            required_fields = ["id", "member_id", "email", "full_name", "registration_date"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                print("✅ All required fields present in response")
            else:
                print(f"❌ Missing fields in response: {missing_fields}")
                
            # Test retrieving the created member
            get_response = requests.get(f"{BACKEND_URL}/members/{member_id}")
            if get_response.status_code == 200:
                print("✅ Member successfully stored and retrievable from Supabase")
            else:
                print("❌ Member not found after creation")
                
            return data
            
        elif response.status_code == 500:
            print("❌ Member registration failed - likely missing members table")
            return None
        else:
            print(f"❌ Member registration failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Member registration error: {str(e)}")
        return None

def test_validation_endpoints():
    """Test validation still works with Supabase"""
    print("\n=== Testing Validation Endpoints ===")
    
    try:
        # Test missing required fields
        incomplete_member = {
            "passport": create_test_passport_image(),
            "full_name": "Incomplete User",
            # Missing email field
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=incomplete_member)
        print(f"POST /api/register (missing email) - Status: {response.status_code}")
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Missing required fields properly rejected")
        else:
            print(f"❌ Missing fields not properly handled: {response.text}")
            
        # Test invalid email format
        invalid_member = {
            "email": "invalid-email-format",  # Invalid email
            "passport": create_test_passport_image(),
            "full_name": "Invalid Email User",
            "dob": "1990-01-01",
            "ward": "Test Ward",
            "lga": "Test LGA",
            "state": "Test State",
            "country": "Nigeria",
            "address": "Test Address",
            "gender": "Male"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=invalid_member)
        print(f"POST /api/register (invalid email) - Status: {response.status_code}")
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Invalid email format properly rejected")
        else:
            print(f"❌ Invalid email format not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ Validation endpoints error: {str(e)}")

def run_supabase_migration_tests():
    """Run focused tests for Supabase migration"""
    print("🚀 Starting ADYC Platform Supabase Migration Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Test basic connectivity
    api_working = test_basic_api_connectivity()
    
    # Test Supabase connection
    supabase_working = test_supabase_connection()
    
    # Test status endpoints
    test_status_endpoints()
    
    # Test member operations
    members_working = test_member_operations()
    
    # Test member registration if tables are working
    if members_working:
        test_member_registration()
    
    # Test validation (should work regardless of tables)
    test_validation_endpoints()
    
    print("\n" + "=" * 60)
    print("🏁 Supabase Migration Testing Complete")
    print("\n📋 SUMMARY:")
    print(f"✅ Basic API Connectivity: {'Working' if api_working else 'Failed'}")
    print(f"{'✅' if supabase_working else '❌'} Supabase Connection: {'Working' if supabase_working else 'Tables Missing'}")
    print(f"{'✅' if members_working else '❌'} Member Operations: {'Working' if members_working else 'Tables Missing'}")
    
    if not supabase_working:
        print("\n🔧 REQUIRED ACTIONS:")
        print("1. Create the following tables in Supabase dashboard:")
        print("   - status_checks (id, client_name, timestamp)")
        print("   - members (id, member_id, email, full_name, dob, ward, lga, state, country, address, gender, passport, language, marital_status, registration_date, id_card_serial_number, id_card_generated, updated_at)")
        print("   - blog_posts (id, title, content, author_email, published, created_at)")
        print("   - admin_users (id, username, email, password_hash, is_active, created_at)")
        print("   - activity_logs (id, user_email, action, resource_type, resource_id, details, ip_address, user_agent, created_at)")
        print("2. Ensure proper column types and constraints are set")
        print("3. Re-run tests after table creation")
    else:
        print("\n✅ Supabase migration appears successful!")
        print("✅ All basic CRUD operations should work")
        print("✅ Email functionality should work (test manually)")

if __name__ == "__main__":
    run_supabase_migration_tests()