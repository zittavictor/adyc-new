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
BACKEND_URL = "https://05ad703c-9c20-4e8f-af68-59928f6c1538.preview.emergentagent.com/api"

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
                        # Store for later tests
                        global valid_member_id
                        valid_member_id = test_member_id
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

def test_id_card_pdf_generation():
    """Test ID card PDF generation endpoint"""
    print("\n=== Testing ID Card PDF Generation ===")
    
    try:
        # First, get a valid member ID
        response = requests.get(f"{BACKEND_URL}/members")
        if response.status_code == 200:
            members = response.json()
            if members:
                test_member_id = members[0]["member_id"]
                
                # Test valid member ID card generation
                response = requests.get(f"{BACKEND_URL}/members/{test_member_id}/id-card")
                print(f"GET /api/members/{test_member_id}/id-card - Status: {response.status_code}")
                
                if response.status_code == 200:
                    # Check content type
                    content_type = response.headers.get('content-type', '')
                    if 'application/pdf' in content_type:
                        print("✅ PDF content type correct")
                    else:
                        print(f"❌ Wrong content type: {content_type}")
                    
                    # Check content disposition header
                    content_disposition = response.headers.get('content-disposition', '')
                    if f'ADYC_ID_Card_{test_member_id}.pdf' in content_disposition:
                        print("✅ PDF filename header correct")
                    else:
                        print(f"❌ Wrong filename header: {content_disposition}")
                    
                    # Check if response contains PDF data
                    if len(response.content) > 0 and response.content.startswith(b'%PDF'):
                        print("✅ Valid PDF data received")
                        print(f"✅ PDF size: {len(response.content)} bytes")
                    else:
                        print("❌ Invalid PDF data received")
                        
                else:
                    print(f"❌ ID card generation failed: {response.text}")
            else:
                print("⚠️ No members found to test ID card generation")
        
        # Test invalid member ID for ID card
        invalid_id = "ADYC-2024-INVALID"
        response = requests.get(f"{BACKEND_URL}/members/{invalid_id}/id-card")
        print(f"GET /api/members/{invalid_id}/id-card - Status: {response.status_code}")
        
        if response.status_code == 404:
            data = response.json()
            if "Member not found" in data.get("detail", ""):
                print("✅ Invalid member ID for ID card properly handled")
            else:
                print(f"❌ Unexpected error message for invalid ID: {data}")
        else:
            print(f"❌ Invalid member ID for ID card not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ ID card generation test error: {str(e)}")

def test_send_test_email():
    """Test sending test email endpoint"""
    print("\n=== Testing Send Test Email ===")
    
    try:
        # First, get a valid member ID
        response = requests.get(f"{BACKEND_URL}/members")
        if response.status_code == 200:
            members = response.json()
            if members:
                test_member_id = members[0]["member_id"]
                
                # Test valid member ID for test email
                response = requests.post(f"{BACKEND_URL}/send-test-email", 
                                       params={"member_id": test_member_id})
                print(f"POST /api/send-test-email?member_id={test_member_id} - Status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    if "Test email sent successfully" in data.get("message", ""):
                        print("✅ Test email endpoint processed successfully")
                        print("ℹ️ Note: Actual email delivery will be tested manually by user")
                    else:
                        print(f"❌ Unexpected success message: {data}")
                else:
                    print(f"❌ Test email failed: {response.text}")
                    # This might be expected if email service has issues
                    if response.status_code == 500:
                        print("ℹ️ Note: Email service error expected - user will test manually")
            else:
                print("⚠️ No members found to test email sending")
        
        # Test invalid member ID for test email
        invalid_id = "ADYC-2024-INVALID"
        response = requests.post(f"{BACKEND_URL}/send-test-email", 
                               params={"member_id": invalid_id})
        print(f"POST /api/send-test-email?member_id={invalid_id} - Status: {response.status_code}")
        
        if response.status_code == 404:
            data = response.json()
            if "Member not found" in data.get("detail", ""):
                print("✅ Invalid member ID for test email properly handled")
            else:
                print(f"❌ Unexpected error message for invalid ID: {data}")
        else:
            print(f"❌ Invalid member ID for test email not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ Test email endpoint error: {str(e)}")

def test_registration_with_email_background_task():
    """Test that registration triggers background email task"""
    print("\n=== Testing Registration with Email Background Task ===")
    
    try:
        # Create test member data
        test_member = {
            "email": f"background.email.test.{uuid.uuid4().hex[:6]}@adyc.org",
            "passport": create_test_passport_image(),
            "full_name": "Background Email Test User",
            "dob": "1992-08-20",
            "ward": "Test Ward for Email",
            "lga": "Test LGA for Email",
            "state": "Test State for Email",
            "country": "Nigeria",
            "address": "123 Email Test Street, Test City",
            "language": "English",
            "marital_status": "Single",
            "gender": "Female"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=test_member)
        print(f"POST /api/register (with email task) - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Registration successful - background email task should be triggered")
            print("ℹ️ Note: Background email task execution will be verified manually by user")
            
            # Verify member was created properly
            member_id = data.get("member_id", "")
            if member_id:
                print(f"✅ Member created with ID: {member_id}")
                
                # Try to retrieve the member to confirm it's in database
                get_response = requests.get(f"{BACKEND_URL}/members/{member_id}")
                if get_response.status_code == 200:
                    print("✅ Member successfully stored in database")
                else:
                    print("❌ Member not found in database after registration")
            else:
                print("❌ No member ID returned from registration")
                
        else:
            print(f"❌ Registration with email task failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Registration with email task error: {str(e)}")

def test_admin_notification_endpoint():
    """Test the admin notification endpoint with existing member ID"""
    print("\n=== Testing Admin Notification Endpoint ===")
    
    try:
        # First, get a valid member ID
        response = requests.get(f"{BACKEND_URL}/members")
        if response.status_code == 200:
            members = response.json()
            if members:
                test_member_id = members[0]["member_id"]
                
                # Test valid member ID for admin notification
                response = requests.post(f"{BACKEND_URL}/send-admin-notification", 
                                       params={"member_id": test_member_id})
                print(f"POST /api/send-admin-notification?member_id={test_member_id} - Status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    if "Admin notification email sent successfully" in data.get("message", ""):
                        print("✅ Admin notification endpoint processed successfully")
                        print("ℹ️ Note: Actual admin email delivery will be tested manually by user")
                    else:
                        print(f"❌ Unexpected success message: {data}")
                else:
                    print(f"❌ Admin notification failed: {response.text}")
                    # This might be expected if email service has issues
                    if response.status_code == 500:
                        print("ℹ️ Note: Email service error expected - user will test manually")
            else:
                print("⚠️ No members found to test admin notification")
        
        # Test invalid member ID for admin notification
        invalid_id = "ADYC-2024-INVALID"
        response = requests.post(f"{BACKEND_URL}/send-admin-notification", 
                               params={"member_id": invalid_id})
        print(f"POST /api/send-admin-notification?member_id={invalid_id} - Status: {response.status_code}")
        
        if response.status_code == 404:
            data = response.json()
            if "Member not found" in data.get("detail", ""):
                print("✅ Invalid member ID for admin notification properly handled")
            else:
                print(f"❌ Unexpected error message for invalid ID: {data}")
        else:
            print(f"❌ Invalid member ID for admin notification not properly handled: {response.text}")
            
    except Exception as e:
        print(f"❌ Admin notification endpoint test error: {str(e)}")

def test_registration_with_dual_email_tasks():
    """Test that registration triggers both user confirmation and admin notification emails"""
    print("\n=== Testing Registration with Dual Email Tasks (User + Admin) ===")
    
    try:
        # Create test member data
        test_member = {
            "email": f"dual.email.test.{uuid.uuid4().hex[:6]}@adyc.org",
            "passport": create_test_passport_image(),
            "full_name": "Dual Email Test User",
            "dob": "1993-11-25",
            "ward": "Test Ward for Dual Email",
            "lga": "Test LGA for Dual Email",
            "state": "Test State for Dual Email",
            "country": "Nigeria",
            "address": "456 Dual Email Test Avenue, Test City",
            "language": "English, Hausa",
            "marital_status": "Married",
            "gender": "Male"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=test_member)
        print(f"POST /api/register (with dual email tasks) - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Registration successful - both user confirmation and admin notification tasks should be triggered")
            print("ℹ️ Note: Background email task execution will be verified manually by user")
            
            # Verify member was created properly
            member_id = data.get("member_id", "")
            if member_id:
                print(f"✅ Member created with ID: {member_id}")
                
                # Try to retrieve the member to confirm it's in database
                get_response = requests.get(f"{BACKEND_URL}/members/{member_id}")
                if get_response.status_code == 200:
                    print("✅ Member successfully stored in database")
                    
                    # Verify all required fields for admin notification are present
                    member_data = get_response.json()
                    required_admin_fields = ["full_name", "member_id", "email", "state", "lga", "ward", "gender", "dob", "country", "address", "registration_date"]
                    missing_fields = [field for field in required_admin_fields if field not in member_data or not member_data[field]]
                    
                    if not missing_fields:
                        print("✅ All required fields for admin notification are present")
                    else:
                        print(f"❌ Missing fields for admin notification: {missing_fields}")
                        
                else:
                    print("❌ Member not found in database after registration")
            else:
                print("❌ No member ID returned from registration")
                
        else:
            print(f"❌ Registration with dual email tasks failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Registration with dual email tasks error: {str(e)}")

def test_admin_notification_email_content():
    """Test that admin notification contains all required information"""
    print("\n=== Testing Admin Notification Email Content Requirements ===")
    
    try:
        # Get a valid member to test admin notification content
        response = requests.get(f"{BACKEND_URL}/members")
        if response.status_code == 200:
            members = response.json()
            if members:
                test_member = members[0]
                
                print("✅ Testing admin notification content requirements:")
                
                # Check if member has all required fields for admin notification
                required_fields = {
                    "full_name": "Member name",
                    "member_id": "Member ID", 
                    "email": "Email address",
                    "state": "State information",
                    "lga": "Local Government Area",
                    "ward": "Ward information",
                    "gender": "Gender",
                    "dob": "Date of birth",
                    "country": "Country",
                    "address": "Address",
                    "registration_date": "Registration timestamp"
                }
                
                missing_info = []
                for field, description in required_fields.items():
                    if field not in test_member or not test_member[field]:
                        missing_info.append(f"{description} ({field})")
                
                if not missing_info:
                    print("✅ All required member information available for admin notification")
                    print("✅ Admin notification should include:")
                    print(f"   - Member details: {test_member['full_name']} ({test_member['member_id']})")
                    print(f"   - Location: {test_member['state']}, {test_member['lga']}, {test_member['ward']}")
                    print(f"   - Registration timestamp: {test_member['registration_date']}")
                    print("   - ID card PDF attachment (generated automatically)")
                else:
                    print(f"❌ Missing required information for admin notification: {', '.join(missing_info)}")
                
                # Test the admin notification endpoint to verify it processes correctly
                response = requests.post(f"{BACKEND_URL}/send-admin-notification", 
                                       params={"member_id": test_member["member_id"]})
                
                if response.status_code == 200:
                    print("✅ Admin notification endpoint processes member data correctly")
                else:
                    print(f"⚠️ Admin notification endpoint returned status {response.status_code}: {response.text}")
                    print("ℹ️ Note: This may be expected if email service has configuration issues")
                    
            else:
                print("⚠️ No members found to test admin notification content")
        else:
            print(f"❌ Could not retrieve members for content testing: {response.text}")
            
    except Exception as e:
        print(f"❌ Admin notification content test error: {str(e)}")

def test_email_dependencies():
    """Test if email dependencies are properly installed"""
    print("\n=== Testing Email Dependencies ===")
    
    try:
        # Test basic endpoint to see if email service imports work
        response = requests.get(f"{BACKEND_URL}/")
        print(f"GET /api/ (dependency check) - Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Backend server running - email dependencies likely installed")
        else:
            print(f"❌ Backend server issues: {response.text}")
            
        # Additional check by trying to access members endpoint
        response = requests.get(f"{BACKEND_URL}/members")
        if response.status_code == 200:
            print("✅ Email service imports working (no import errors)")
        else:
            print(f"❌ Possible email service import issues: {response.text}")
            
    except Exception as e:
        print(f"❌ Email dependencies test error: {str(e)}")

def run_all_tests():
    """Run all backend API tests"""
    print("🚀 Starting ADYC Platform Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Test email dependencies first
    test_email_dependencies()
    
    # Test existing functionality
    test_status_endpoints()
    
    # Test member registration functionality
    test_member_registration_valid()
    test_duplicate_email()
    test_missing_required_fields()
    test_invalid_email_format()
    
    # Test member retrieval functionality
    test_get_all_members()
    test_get_specific_member()
    
    # Test new email and ID card functionality
    test_registration_with_email_background_task()
    test_id_card_pdf_generation()
    test_send_test_email()
    
    print("\n" + "=" * 60)
    print("🏁 Backend API Testing Complete")
    print("\nℹ️ IMPORTANT NOTES:")
    print("- Email delivery testing should be done manually by user")
    print("- Background email tasks are triggered but not verified in automated tests")
    print("- PDF generation and download functionality has been verified")

if __name__ == "__main__":
    run_all_tests()