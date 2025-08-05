#!/usr/bin/env python3
"""
Backend API Testing for ADYC Platform
Tests the enhanced member registration system with email field and improved ID generation.
"""

import requests
import json
import base64
import uuid
from datetime import datetime
import re

# Configuration
BACKEND_URL = "https://0eb8ab0b-f184-4259-b971-4a8dca334b16.preview.emergentagent.com/api"

def create_test_passport_image():
    """Create a simple base64 encoded test image"""
    # Simple 1x1 pixel PNG in base64
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

def test_status_endpoints():
    """Test existing status endpoints for backward compatibility"""
    print("\n=== Testing Status Endpoints (Backward Compatibility) ===")
    
    try:
        # Test GET /api/status
        response = requests.get(f"{BACKEND_URL}/status")
        print(f"GET /api/status - Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Status endpoint working")
        else:
            print(f"❌ Status endpoint failed: {response.text}")
            
        # Test POST /api/status
        test_data = {"client_name": "ADYC Test Client"}
        response = requests.post(f"{BACKEND_URL}/status", json=test_data)
        print(f"POST /api/status - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "client_name" in data and "timestamp" in data:
                print("✅ Status creation working")
            else:
                print(f"❌ Status creation response missing fields: {data}")
        else:
            print(f"❌ Status creation failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Status endpoints error: {str(e)}")

def test_member_registration_valid():
    """Test valid member registration with all required fields"""
    print("\n=== Testing Valid Member Registration ===")
    
    try:
        # Create test member data
        test_member = {
            "email": f"adeyemi.ogundimu{uuid.uuid4().hex[:6]}@adyc.org",
            "passport": create_test_passport_image(),
            "full_name": "Adeyemi Ogundimu",
            "dob": "1995-03-15",
            "ward": "Ikeja Ward 1",
            "lga": "Ikeja",
            "state": "Lagos",
            "country": "Nigeria",
            "address": "123 Allen Avenue, Ikeja, Lagos State",
            "language": "English, Yoruba",
            "marital_status": "Single",
            "gender": "Male"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=test_member)
        print(f"POST /api/register - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Member registration successful")
            
            # Verify member ID format (ADYC-YYYY-XXXXXX)
            member_id = data.get("member_id", "")
            current_year = datetime.now().year
            pattern = f"ADYC-{current_year}-[A-F0-9]{{6}}"
            
            if re.match(pattern, member_id):
                print(f"✅ Member ID format correct: {member_id}")
            else:
                print(f"❌ Member ID format incorrect: {member_id} (expected: ADYC-{current_year}-XXXXXX)")
            
            # Verify all fields are present
            required_fields = ["id", "member_id", "email", "full_name", "dob", "ward", "lga", "state", "country", "address", "gender", "registration_date"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                print("✅ All required fields present in response")
            else:
                print(f"❌ Missing fields in response: {missing_fields}")
                
            # Store member_id for later tests
            global test_member_id
            test_member_id = member_id
            
            return data
            
        else:
            print(f"❌ Member registration failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Member registration error: {str(e)}")
        return None

def test_duplicate_email():
    """Test duplicate email handling"""
    print("\n=== Testing Duplicate Email Handling ===")
    
    try:
        # Generate a unique email for this test
        unique_id = uuid.uuid4().hex[:8]
        test_email = f"duplicate.test.{unique_id}@adyc.org"
        
        # First register a member with a specific email
        first_member = {
            "email": test_email,
            "passport": create_test_passport_image(),
            "full_name": "First User",
            "dob": "1990-01-01",
            "ward": "Test Ward",
            "lga": "Test LGA",
            "state": "Test State",
            "country": "Nigeria",
            "address": "Test Address",
            "language": "English",
            "marital_status": "Single",
            "gender": "Male"
        }
        
        # Register first member
        response = requests.post(f"{BACKEND_URL}/register", json=first_member)
        if response.status_code != 200:
            print(f"❌ Failed to register first member: {response.text}")
            return
        
        # Now try to register with the same email
        duplicate_member = {
            "email": test_email,  # Same email
            "passport": create_test_passport_image(),
            "full_name": "Another Person",
            "dob": "1990-01-01",
            "ward": "Test Ward",
            "lga": "Test LGA",
            "state": "Test State",
            "country": "Nigeria",
            "address": "Test Address",
            "language": "English",
            "marital_status": "Single",
            "gender": "Female"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=duplicate_member)
        print(f"POST /api/register (duplicate email) - Status: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            if "Email already registered" in data.get("detail", ""):
                print("✅ Duplicate email properly rejected")
            else:
                print(f"❌ Unexpected error message: {data}")
        else:
            print(f"❌ Duplicate email not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ Duplicate email test error: {str(e)}")

def test_missing_required_fields():
    """Test registration with missing required fields"""
    print("\n=== Testing Missing Required Fields ===")
    
    try:
        # Test with missing email
        incomplete_member = {
            "passport": create_test_passport_image(),
            "full_name": "Incomplete User",
            "dob": "1990-01-01",
            "ward": "Test Ward",
            "lga": "Test LGA",
            "state": "Test State",
            "country": "Nigeria",
            "address": "Test Address",
            "gender": "Male"
            # Missing email field
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=incomplete_member)
        print(f"POST /api/register (missing email) - Status: {response.status_code}")
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Missing required fields properly rejected")
        else:
            print(f"❌ Missing fields not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ Missing fields test error: {str(e)}")

def test_invalid_email_format():
    """Test registration with invalid email format"""
    print("\n=== Testing Invalid Email Format ===")
    
    try:
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
            "language": "English",
            "marital_status": "Single",
            "gender": "Male"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=invalid_member)
        print(f"POST /api/register (invalid email) - Status: {response.status_code}")
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Invalid email format properly rejected")
        else:
            print(f"❌ Invalid email format not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ Invalid email test error: {str(e)}")

def test_get_all_members():
    """Test retrieving all members"""
    print("\n=== Testing Get All Members ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/members")
        print(f"GET /api/members - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Retrieved {len(data)} members successfully")
                
                # Check if our test member is in the list
                if data and any(member.get("email", "").startswith("adeyemi.ogundimu") for member in data):
                    print("✅ Test member found in members list")
                else:
                    print("⚠️ Test member not found in members list (may be expected if database was cleared)")
            else:
                print(f"❌ Expected list response, got: {type(data)}")
        else:
            print(f"❌ Get all members failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get all members error: {str(e)}")

def test_get_specific_member():
    """Test retrieving a specific member by ID"""
    print("\n=== Testing Get Specific Member ===")
    
    try:
        # First, get all members to find a valid member_id
        response = requests.get(f"{BACKEND_URL}/members")
        if response.status_code == 200:
            members = response.json()
            if members:
                test_member_id = members[0]["member_id"]
                
                # Test valid member ID
                response = requests.get(f"{BACKEND_URL}/members/{test_member_id}")
                print(f"GET /api/members/{test_member_id} - Status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("member_id") == test_member_id:
                        print("✅ Specific member retrieved successfully")
                    else:
                        print(f"❌ Retrieved wrong member: expected {test_member_id}, got {data.get('member_id')}")
                else:
                    print(f"❌ Get specific member failed: {response.text}")
            else:
                print("⚠️ No members found to test specific retrieval")
        
        # Test invalid member ID
        invalid_id = "ADYC-2024-INVALID"
        response = requests.get(f"{BACKEND_URL}/members/{invalid_id}")
        print(f"GET /api/members/{invalid_id} - Status: {response.status_code}")
        
        if response.status_code == 404:
            data = response.json()
            if "Member not found" in data.get("detail", ""):
                print("✅ Invalid member ID properly handled")
            else:
                print(f"❌ Unexpected error message for invalid ID: {data}")
        else:
            print(f"❌ Invalid member ID not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ Get specific member error: {str(e)}")

def run_all_tests():
    """Run all backend API tests"""
    print("🚀 Starting ADYC Platform Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Test existing functionality first
    test_status_endpoints()
    
    # Test new member registration functionality
    test_member_registration_valid()
    test_duplicate_email()
    test_missing_required_fields()
    test_invalid_email_format()
    
    # Test member retrieval functionality
    test_get_all_members()
    test_get_specific_member()
    
    print("\n" + "=" * 60)
    print("🏁 Backend API Testing Complete")

if __name__ == "__main__":
    run_all_tests()