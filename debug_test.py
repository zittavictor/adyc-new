#!/usr/bin/env python3
"""
Debug test to identify specific issues with ADYC backend
"""

import requests
import json
import base64
import uuid
from datetime import datetime

# Configuration
BACKEND_URL = "https://adyc-bugfix.preview.emergentagent.com/api"

def create_test_passport_image():
    """Create a simple base64 encoded test image"""
    # Simple 1x1 pixel PNG in base64
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

def debug_member_registration():
    """Debug member registration issues"""
    print("\n=== Debugging Member Registration ===")
    
    try:
        # Create test member data
        test_member = {
            "email": f"debug.test.{uuid.uuid4().hex[:6]}@adyc.org",
            "passport": create_test_passport_image(),
            "full_name": "Debug Test Member",
            "dob": "1995-06-20",
            "ward": "Debug Ward",
            "lga": "Debug LGA",
            "state": "Debug State",
            "country": "Nigeria",
            "address": "123 Debug Street, Debug City",
            "language": "English",
            "marital_status": "Single",
            "gender": "Male"
        }
        
        print(f"Attempting to register member: {test_member['email']}")
        response = requests.post(f"{BACKEND_URL}/register", json=test_member)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Registration successful: {data.get('member_id')}")
            return data.get('member_id')
        else:
            print(f"❌ Registration failed")
            print(f"Response Text: {response.text}")
            try:
                error_data = response.json()
                print(f"Error JSON: {json.dumps(error_data, indent=2)}")
            except:
                pass
            return None
            
    except Exception as e:
        print(f"❌ Exception during registration: {str(e)}")
        return None

def debug_blog_creation():
    """Debug blog post creation issues"""
    print("\n=== Debugging Blog Post Creation ===")
    
    try:
        # First login as admin
        login_data = {
            "username": "adyc_admin",
            "password": "SecurePassword123"
        }
        
        response = requests.post(f"{BACKEND_URL}/admin/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Admin login failed: {response.text}")
            return
        
        token_data = response.json()
        admin_token = token_data["access_token"]
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Try to create blog post
        blog_post_data = {
            "title": "Debug Test Blog Post",
            "content": "This is a debug test of the blog creation system.",
            "summary": "Debug test summary",
            "published": True
        }
        
        print(f"Attempting to create blog post: {blog_post_data['title']}")
        response = requests.post(f"{BACKEND_URL}/admin/blog/posts", json=blog_post_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Blog post creation successful: {data.get('id')}")
        else:
            print(f"❌ Blog post creation failed")
            print(f"Response Text: {response.text}")
            try:
                error_data = response.json()
                print(f"Error JSON: {json.dumps(error_data, indent=2)}")
            except:
                pass
            
    except Exception as e:
        print(f"❌ Exception during blog creation: {str(e)}")

def debug_supabase_connection():
    """Debug Supabase connection"""
    print("\n=== Debugging Supabase Connection ===")
    
    try:
        # Test status check creation (simple Supabase operation)
        status_data = {
            "client_name": "debug_test_client"
        }
        
        response = requests.post(f"{BACKEND_URL}/status", json=status_data)
        print(f"Status Check Creation - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Supabase connection working for status checks")
        else:
            print(f"❌ Supabase connection issue: {response.text}")
            
        # Test getting status checks
        response = requests.get(f"{BACKEND_URL}/status")
        print(f"Status Check Retrieval - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Retrieved {len(data)} status checks")
        else:
            print(f"❌ Status check retrieval failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception during Supabase testing: {str(e)}")

def debug_service_dependencies():
    """Debug service dependencies"""
    print("\n=== Debugging Service Dependencies ===")
    
    try:
        # Test basic connectivity
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Basic API connectivity: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ FastAPI server is running")
        else:
            print("❌ FastAPI server issue")
            
    except Exception as e:
        print(f"❌ Exception during service testing: {str(e)}")

if __name__ == "__main__":
    print("🔍 Starting ADYC Backend Debug Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    debug_service_dependencies()
    debug_supabase_connection()
    debug_member_registration()
    debug_blog_creation()
    
    print("\n" + "=" * 60)
    print("🏁 Debug Testing Complete")