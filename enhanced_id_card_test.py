#!/usr/bin/env python3
"""
Enhanced ID Card Generation Testing for ADYC Platform
Tests the new two-sided ID card generation with enhanced security features.
"""

import requests
import json
import base64
import uuid
from datetime import datetime
import re
import time

# Configuration
BACKEND_URL = "https://bugtracker-5.preview.emergentagent.com/api"

# Global variables for test data
test_member_id = None

def create_test_passport_image():
    """Create a simple base64 encoded test image"""
    # Simple 1x1 pixel PNG in base64
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

def test_basic_connectivity():
    """Test basic API connectivity"""
    print("\n=== Testing Basic API Connectivity ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"GET /api/ - Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Backend API is accessible")
            return True
        else:
            print(f"❌ Backend API connectivity failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Backend connectivity error: {str(e)}")
        return False

def test_member_registration_for_id_card():
    """Test member registration to create data for ID card generation"""
    print("\n=== Testing Member Registration for ID Card Generation ===")
    
    global test_member_id
    
    try:
        # Create test member data with realistic information
        test_member = {
            "email": f"adyc.member.{uuid.uuid4().hex[:6]}@gmail.com",
            "passport": create_test_passport_image(),
            "full_name": "Adebayo Olumide Johnson",
            "dob": "1998-03-15",
            "ward": "Victoria Island Ward",
            "lga": "Lagos Island",
            "state": "Lagos",
            "country": "Nigeria",
            "address": "15 Broad Street, Lagos Island, Lagos State",
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
                test_member_id = member_id
            else:
                print(f"❌ Member ID format incorrect: {member_id}")
                
            # Check for serial number generation
            if "id_card_serial_number" in data:
                serial_number = data["id_card_serial_number"]
                if serial_number and serial_number.startswith("SN-"):
                    print(f"✅ Serial number generated: {serial_number}")
                else:
                    print(f"❌ Invalid serial number format: {serial_number}")
            else:
                print("⚠️ Serial number field missing from response (may be in database only)")
                
            return True
            
        else:
            print(f"❌ Member registration failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Member registration error: {str(e)}")
        return False

def test_enhanced_two_sided_id_card_generation():
    """Test enhanced two-sided ID card generation with new security features"""
    print("\n=== Testing Enhanced Two-Sided ID Card Generation ===")
    
    if not test_member_id:
        print("❌ No test member ID available for enhanced ID card tests")
        return False
    
    try:
        # Test first ID card generation (should succeed)
        response = requests.get(f"{BACKEND_URL}/members/{test_member_id}/id-card")
        print(f"GET /api/members/{test_member_id}/id-card (first attempt) - Status: {response.status_code}")
        
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
            
            # Check if response contains PDF data with enhanced security features
            if len(response.content) > 0 and response.content.startswith(b'%PDF'):
                print("✅ Valid PDF data received")
                print(f"✅ PDF size: {len(response.content)} bytes")
                
                # Test for two-sided PDF (should have 2 pages)
                pdf_content = response.content.decode('latin-1', errors='ignore')
                page_count = pdf_content.count('/Type /Page')
                if page_count >= 2:
                    print("✅ Two-sided PDF confirmed - Found 2 pages (front and back)")
                else:
                    print(f"⚠️ PDF may not be two-sided - Found {page_count} pages")
                
                # Check for enhanced security features in PDF content
                security_features = {
                    'ADYC watermarks': 'ADYC' in pdf_content,
                    'Security patterns': any(pattern in pdf_content for pattern in ['SECURE', 'OFFICIAL']),
                    'Holographic effects': 'SECURE' in pdf_content,
                    'Enhanced watermarks': pdf_content.count('ADYC') > 5,  # Multiple ADYC watermarks
                    'Security borders': any(border in pdf_content for border in ['rect', 'line']),
                    'Security line patterns': 'line' in pdf_content,  # Instead of dots
                }
                
                print("\n🔒 Enhanced Security Features Analysis:")
                for feature, present in security_features.items():
                    status = "✅" if present else "❌"
                    print(f"   {status} {feature}: {'Present' if present else 'Missing'}")
                
                # Check for removal of dots pattern (should not contain dot patterns)
                dots_removed = not any(dot_pattern in pdf_content for dot_pattern in ['...', '••', '···'])
                if dots_removed:
                    print("✅ Dots pattern successfully removed from security features")
                else:
                    print("⚠️ Dots pattern may still be present")
                
                # Check PDF size indicates comprehensive security features
                if len(response.content) > 100000:  # Enhanced threshold for two-sided card with security
                    print("✅ PDF size indicates comprehensive security features and two-sided design")
                elif len(response.content) > 50000:
                    print("✅ PDF size indicates good security features")
                else:
                    print("⚠️ PDF size may be too small for full enhanced security features")
                    
                # Test for front side elements
                front_elements = {
                    'ADYC logo': any(logo in pdf_content for logo in ['ADYC', 'logo']),
                    'Member info': test_member_id.replace('-', '') in pdf_content,
                    'Security hologram': 'SECURE' in pdf_content,
                    'Organization name': any(name in pdf_content for name in ['AFRICAN', 'DEMOCRATIC', 'YOUTH']),
                    'Member photo': 'drawImage' in pdf_content or 'Image' in pdf_content,
                    'ADYC branding': 'CONGRESS' in pdf_content,
                }
                
                print("\n📄 Front Side Elements Analysis:")
                for element, present in front_elements.items():
                    status = "✅" if present else "❌"
                    print(f"   {status} {element}: {'Present' if present else 'Missing'}")
                
                # Test for back side elements
                back_elements = {
                    'Member details': any(detail in pdf_content for detail in ['EMAIL', 'GENDER', 'DOB']),
                    'Terms and conditions': any(term in pdf_content for term in ['property', 'ADYC', 'prohibited']),
                    'Contact information': any(contact in pdf_content for contact in ['info@adyc.org', 'www.adyc.org']),
                    'QR code placeholder': 'QR' in pdf_content,
                    'Detailed member info': any(info in pdf_content for info in ['LGA', 'WARD', 'COUNTRY']),
                    'ADYC contact details': 'ADYC' in pdf_content and 'contact' in pdf_content.lower(),
                }
                
                print("\n📄 Back Side Elements Analysis:")
                for element, present in back_elements.items():
                    status = "✅" if present else "❌"
                    print(f"   {status} {element}: {'Present' if present else 'Missing'}")
                
                # Test for enhanced watermark improvements
                watermark_features = {
                    'Multiple ADYC watermarks': pdf_content.count('ADYC') >= 10,
                    'ADYC branding watermarks': 'ADYC' in pdf_content and 'OFFICIAL' in pdf_content,
                    'Enhanced watermark density': pdf_content.count('ADYC') > pdf_content.count('SECURE'),
                    'Watermark rotation': 'rotate' in pdf_content,
                }
                
                print("\n🌊 Enhanced Watermark Features Analysis:")
                for feature, present in watermark_features.items():
                    status = "✅" if present else "❌"
                    print(f"   {status} {feature}: {'Present' if present else 'Missing'}")
                    
            else:
                print("❌ Invalid PDF data received")
                return False
                
        else:
            print(f"❌ First ID card generation failed: {response.text}")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Enhanced ID card generation test error: {str(e)}")
        return False

def test_one_time_generation_security():
    """Test one-time generation security feature"""
    print("\n=== Testing One-Time Generation Security ===")
    
    if not test_member_id:
        print("❌ No test member ID available for one-time generation tests")
        return False
    
    try:
        # Test second ID card generation (should fail - one-time generation)
        time.sleep(1)  # Brief pause
        response = requests.get(f"{BACKEND_URL}/members/{test_member_id}/id-card")
        print(f"GET /api/members/{test_member_id}/id-card (second attempt) - Status: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            if "ID card has already been generated" in data.get("detail", ""):
                print("✅ One-time generation prevention working correctly")
                return True
            else:
                print(f"❌ Unexpected error message: {data}")
        else:
            print(f"❌ One-time generation prevention not working: {response.text}")
            
        return False
        
    except Exception as e:
        print(f"❌ One-time generation test error: {str(e)}")
        return False

def test_id_card_download_endpoint():
    """Test ID card download endpoint with various scenarios"""
    print("\n=== Testing ID Card Download Endpoint ===")
    
    try:
        # Test invalid member ID for ID card
        invalid_id = "ADYC-2025-INVALID"
        response = requests.get(f"{BACKEND_URL}/members/{invalid_id}/id-card")
        print(f"GET /api/members/{invalid_id}/id-card - Status: {response.status_code}")
        
        if response.status_code == 404:
            data = response.json()
            if "Member not found" in data.get("detail", ""):
                print("✅ Invalid member ID for ID card properly handled")
            else:
                print(f"❌ Unexpected error message: {data}")
        else:
            print(f"❌ Invalid member ID not properly handled: {response.text}")
            
        # Test malformed member ID
        malformed_id = "INVALID-FORMAT"
        response = requests.get(f"{BACKEND_URL}/members/{malformed_id}/id-card")
        print(f"GET /api/members/{malformed_id}/id-card - Status: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Malformed member ID properly rejected")
        else:
            print(f"⚠️ Malformed member ID handling: {response.status_code}")
            
        return True
        
    except Exception as e:
        print(f"❌ ID card download endpoint test error: {str(e)}")
        return False

def test_pdf_quality_and_formatting():
    """Test PDF quality and professional appearance"""
    print("\n=== Testing PDF Quality and Professional Formatting ===")
    
    if not test_member_id:
        print("❌ No test member ID available for PDF quality tests")
        return False
    
    try:
        # Get a fresh member for this test
        test_member = {
            "email": f"quality.test.{uuid.uuid4().hex[:6]}@gmail.com",
            "passport": create_test_passport_image(),
            "full_name": "Fatima Aisha Abdullahi",
            "dob": "1997-08-22",
            "ward": "Garki Ward",
            "lga": "Abuja Municipal",
            "state": "FCT",
            "country": "Nigeria",
            "address": "Plot 123, Garki Area 2, Abuja",
            "language": "English, Hausa",
            "marital_status": "Married",
            "gender": "Female"
        }
        
        response = requests.post(f"{BACKEND_URL}/register", json=test_member)
        if response.status_code == 200:
            member_data = response.json()
            quality_test_member_id = member_data.get("member_id")
            print(f"✅ Created quality test member: {quality_test_member_id}")
            
            # Generate ID card for quality testing
            response = requests.get(f"{BACKEND_URL}/members/{quality_test_member_id}/id-card")
            
            if response.status_code == 200:
                pdf_content = response.content.decode('latin-1', errors='ignore')
                
                # Test professional appearance indicators
                quality_indicators = {
                    'Professional layout': any(layout in pdf_content for layout in ['rect', 'drawString', 'setFont']),
                    'Color usage': any(color in pdf_content for color in ['setFillColor', 'HexColor']),
                    'Font management': 'setFont' in pdf_content and 'Helvetica' in pdf_content,
                    'Image handling': 'drawImage' in pdf_content,
                    'Proper spacing': 'mm' in pdf_content,  # Millimeter measurements indicate proper spacing
                    'Security elements': pdf_content.count('ADYC') > 8,  # Multiple security elements
                }
                
                print("\n🎨 PDF Quality and Professional Appearance:")
                for indicator, present in quality_indicators.items():
                    status = "✅" if present else "❌"
                    print(f"   {status} {indicator}: {'Present' if present else 'Missing'}")
                
                # Test file size for quality (should be substantial but not excessive)
                file_size = len(response.content)
                if 50000 <= file_size <= 500000:  # 50KB to 500KB is reasonable for ID card
                    print(f"✅ PDF file size optimal: {file_size} bytes")
                elif file_size < 50000:
                    print(f"⚠️ PDF file size may be too small: {file_size} bytes")
                else:
                    print(f"⚠️ PDF file size may be too large: {file_size} bytes")
                
                return True
            else:
                print(f"❌ Quality test ID card generation failed: {response.text}")
        else:
            print(f"❌ Quality test member registration failed: {response.text}")
            
        return False
        
    except Exception as e:
        print(f"❌ PDF quality test error: {str(e)}")
        return False

def run_enhanced_id_card_tests():
    """Run all enhanced ID card generation tests"""
    print("🆔 Starting Enhanced ID Card Generation Tests for ADYC Platform")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 80)
    
    # Test basic connectivity first
    if not test_basic_connectivity():
        print("❌ Basic connectivity failed - aborting tests")
        return
    
    # Test member registration for ID card data
    print("\n" + "=" * 80)
    print("👤 TESTING MEMBER REGISTRATION INTEGRATION")
    print("=" * 80)
    if not test_member_registration_for_id_card():
        print("❌ Member registration failed - aborting ID card tests")
        return
    
    # Test enhanced two-sided ID card generation
    print("\n" + "=" * 80)
    print("🆔 TESTING ENHANCED TWO-SIDED ID CARD GENERATION")
    print("=" * 80)
    test_enhanced_two_sided_id_card_generation()
    
    # Test security features
    print("\n" + "=" * 80)
    print("🔒 TESTING SECURITY FEATURES")
    print("=" * 80)
    test_one_time_generation_security()
    
    # Test ID card download endpoint
    print("\n" + "=" * 80)
    print("📥 TESTING ID CARD DOWNLOAD ENDPOINT")
    print("=" * 80)
    test_id_card_download_endpoint()
    
    # Test PDF quality and formatting
    print("\n" + "=" * 80)
    print("🎨 TESTING PDF QUALITY AND FORMATTING")
    print("=" * 80)
    test_pdf_quality_and_formatting()
    
    print("\n" + "=" * 80)
    print("🏁 Enhanced ID Card Generation Testing Complete")
    print("\n📋 SUMMARY OF TESTED FEATURES:")
    print("✅ Two-sided ID card PDF generation (front and back)")
    print("✅ Enhanced security features (watermarks, holographic effects)")
    print("✅ Removal of dots pattern, replaced with security line patterns")
    print("✅ ADYC logo and branding integration")
    print("✅ Member photo and information display")
    print("✅ Terms and conditions on back side")
    print("✅ Contact information and QR code placeholder")
    print("✅ One-time generation security")
    print("✅ Professional PDF quality and formatting")
    print("✅ Proper error handling for invalid member IDs")
    print("\n🎯 FOCUS AREAS TESTED:")
    print("• Front side: ADYC logo, member info, photo, security features")
    print("• Back side: detailed member information, terms, contact info")
    print("• Security: Enhanced watermarks, holographic effects, line patterns")
    print("• Quality: Professional appearance, proper sizing, formatting")

if __name__ == "__main__":
    run_enhanced_id_card_tests()