#!/usr/bin/env python3
"""
ADYC Admin Setup Script
This script helps you create your admin account securely.
"""
import requests
import json
import os
from getpass import getpass

def setup_admin():
    print("🔧 ADYC Admin Setup")
    print("=" * 50)
    
    # Get backend URL from environment
    backend_url = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    
    print(f"Backend URL: {backend_url}")
    print()
    
    # Get admin details from user
    print("Please provide your admin details:")
    username = input("Admin Username: ").strip()
    email = input("Admin Email: ").strip()
    
    # Get password securely
    while True:
        password = getpass("Admin Password: ")
        password_confirm = getpass("Confirm Password: ")
        
        if password == password_confirm:
            if len(password) < 8:
                print("❌ Password must be at least 8 characters long")
                continue
            break
        else:
            print("❌ Passwords don't match. Please try again.")
    
    # Setup key (this is the secure key from your backend)
    setup_key = "adyc-setup-2025-secure"
    
    # Prepare the request
    url = f"{backend_url}/api/setup/admin"
    data = {
        "username": username,
        "email": email, 
        "password": password,
        "setup_key": setup_key
    }
    
    print("\n🔄 Creating admin account...")
    
    try:
        # Make the request
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success! Admin account created successfully!")
            print(f"👤 Username: {username}")
            print(f"📧 Email: {email}")
            print(f"\n🎉 You can now use these credentials to log into the admin panel.")
            
        elif response.status_code == 400:
            error_detail = response.json().get('detail', 'Unknown error')
            if 'already exists' in error_detail:
                print(f"ℹ️  Admin account already exists for username: {username}")
                print("You can use the existing account or choose a different username.")
            else:
                print(f"❌ Error: {error_detail}")
                
        elif response.status_code == 403:
            print("❌ Error: Invalid setup key. This shouldn't happen with this script.")
            
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to backend server.")
        print("Please make sure the backend is running and try again.")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    setup_admin()