import smtplib
import os
import base64
import io
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.units import inch, mm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage
from io import BytesIO
import requests
import logging
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('EMAIL_PORT', '587'))
        self.username = os.getenv('EMAIL_USERNAME')
        self.password = os.getenv('EMAIL_PASSWORD')
        self.use_tls = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
        
        if not self.username or not self.password:
            raise ValueError("Email credentials not configured properly")

    def generate_id_card_pdf(self, member_data):
        """Generate an enhanced ID card PDF with front and back sides"""
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        from reportlab.lib.units import mm
        from reportlab.lib import colors
        from reportlab.lib.utils import ImageReader
        import io
        import base64
        
        try:
            # Create PDF buffer
            buffer = io.BytesIO()
            
            # ID card dimensions (credit card size)
            card_width = 85.6*mm  # Standard credit card width
            card_height = 53.98*mm  # Standard credit card height
            
            # Create canvas with two pages (front and back)
            c = canvas.Canvas(buffer, pagesize=(card_width, card_height))
            
            # =================== FRONT SIDE ===================
            self._generate_front_side(c, member_data, card_width, card_height)
            c.showPage()  # Move to next page
            
            # =================== BACK SIDE ===================
            self._generate_back_side(c, member_data, card_width, card_height)
            
            # Save PDF
            c.save()
            buffer.seek(0)
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Error generating ID card PDF: {e}")
            raise
    
    def _generate_front_side(self, c, member_data, card_width, card_height):
        """Generate the front side of the ID card with specific layout"""
        from reportlab.lib.units import mm
        from reportlab.lib import colors
        from reportlab.lib.utils import ImageReader
        import io
        import base64
        
        # Background gradient effect
        c.setFillColor(colors.HexColor('#f8fafc'))
        c.rect(0, 0, card_width, card_height, fill=1)
        
        # Enhanced watermark - Multiple ADYC logos for forgery prevention
        c.saveState()
        c.setFillColor(colors.HexColor('#f8f9fa'))
        c.setFillAlpha(0.06)  # Very subtle watermark
        c.setFont("Helvetica-Bold", 14)
        
        # Create a complex watermark pattern
        c.rotate(30)
        for i in range(-20, 40, 12):
            for j in range(-10, 20, 8):
                c.drawString(i*mm, j*mm, "ADYC")
                c.drawString(i*mm+2*mm, j*mm-2*mm, "OFFICIAL")
        c.restoreState()
        
        # Security line pattern
        c.saveState()
        c.setStrokeColor(colors.HexColor('#e5e7eb'))
        c.setLineWidth(0.1)
        for i in range(0, int(card_width/mm), 3):
            c.line(i*mm, 0, i*mm, card_height)
        for j in range(0, int(card_height/mm), 3):
            c.line(0, j*mm, card_width, j*mm)
        c.restoreState()
        
        # Header section with ADYC logo
        try:
            # ADYC Logo
            logo_size = 14*mm
            c.drawImage(
                "https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg",
                4*mm, card_height-18*mm, 
                width=logo_size, height=logo_size,
                preserveAspectRatio=True, mask='auto'
            )
        except:
            # Fallback logo
            c.setFillColor(colors.HexColor('#f97316'))
            c.rect(4*mm, card_height-18*mm, 14*mm, 14*mm, fill=1)
            c.setFillColor(colors.white)
            c.setFont("Helvetica-Bold", 8)
            c.drawString(7*mm, card_height-13*mm, "ADYC")
        
        # Organization name
        c.setFillColor(colors.black)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(20*mm, card_height-8*mm, "AFRICAN DEMOCRATIC")
        c.drawString(20*mm, card_height-12*mm, "YOUTH CONGRESS")
        
        # Member photo
        try:
            passport_data = member_data.get('passport')
            if passport_data:
                photo_stream = None
                
                # Handle both Cloudinary URLs and base64 data
                if passport_data.startswith('http'):
                    # It's a Cloudinary URL - download and optimize
                    photo_stream = self._download_and_optimize_photo(passport_data)
                elif ',' in passport_data:
                    # It's base64 data - decode it
                    image_data = base64.b64decode(passport_data.split(',')[1])
                    photo_stream = self._optimize_photo_from_bytes(image_data)
                
                if photo_stream:
                    img = ImageReader(photo_stream)
                    
                    photo_width = 16*mm
                    photo_height = 20*mm
                    photo_x = card_width - photo_width - 4*mm
                    photo_y = card_height - photo_height - 4*mm
                    
                    c.drawImage(img, photo_x, photo_y, width=photo_width, height=photo_height, preserveAspectRatio=True, mask='auto')
                    
                    # Photo frame with security border
                    c.setStrokeColor(colors.HexColor('#f97316'))
                    c.setLineWidth(1.5)
                    c.rect(photo_x-1, photo_y-1, photo_width+2, photo_height+2, fill=0, stroke=1)
                    return  # Photo successfully added
                    
        except Exception as e:
            logger.warning(f"Error processing member photo: {e}")
            
        # Fallback photo placeholder
        photo_x = card_width - 16*mm - 4*mm
        photo_y = card_height - 20*mm - 4*mm
        c.setFillColor(colors.HexColor('#e5e7eb'))
        c.rect(photo_x, photo_y, 16*mm, 20*mm, fill=1)
        c.setFillColor(colors.HexColor('#6b7280'))
        c.setFont("Helvetica", 6)
        c.drawString(photo_x+5*mm, photo_y+9*mm, "PHOTO")
        
        # Member information - Specific layout as requested
        info_start_y = card_height - 26*mm
        c.setFillColor(colors.black)
        
        # NAME: ZITTA VICTOR
        c.setFont("Helvetica-Bold", 7)
        c.drawString(4*mm, info_start_y, "NAME:")
        c.setFont("Times-Bold", 8)  # Using Times font as shown in image
        name = member_data.get('full_name', 'ZITTA VICTOR').upper()
        c.drawString(4*mm, info_start_y-3*mm, name)
        
        # ID: ADYC-2025-5A5514
        c.setFont("Helvetica-Bold", 7)
        c.drawString(4*mm, info_start_y-8*mm, "ID:")
        c.setFont("Times-Bold", 8)
        member_id = member_data.get('member_id', 'ADYC-2025-5A5514')
        c.drawString(4*mm, info_start_y-11*mm, member_id)
        
        # STATE: PLATEAU
        c.setFont("Helvetica-Bold", 7)
        c.drawString(4*mm, info_start_y-16*mm, "STATE:")
        c.setFont("Times-Bold", 8)
        state = member_data.get('state', 'PLATEAU').upper()
        c.drawString(15*mm, info_start_y-16*mm, state)
        
        # EMAIL: zittavictor26@gmail.com (on right side)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(45*mm, info_start_y, "EMAIL:")
        c.setFont("Times-Roman", 6)
        email = member_data.get('email', 'zittavictor26@gmail.com')[:30]  # Truncate long emails
        c.drawString(45*mm, info_start_y-3*mm, email)
        
        # GENDER: MALE
        c.setFont("Helvetica-Bold", 7)
        c.drawString(45*mm, info_start_y-8*mm, "GENDER:")
        c.setFont("Times-Bold", 8)
        gender = member_data.get('gender', 'MALE').upper()
        c.drawString(58*mm, info_start_y-8*mm, gender)
        
        # DOB: 2005-07-15
        c.setFont("Helvetica-Bold", 7)
        c.drawString(45*mm, info_start_y-13*mm, "DOB:")
        c.setFont("Times-Bold", 8)
        dob = member_data.get('dob', '2005-07-15')
        c.drawString(52*mm, info_start_y-13*mm, dob)
        
        # LGA: JOS NORTH
        c.setFont("Helvetica-Bold", 7)
        c.drawString(45*mm, info_start_y-18*mm, "LGA:")
        c.setFont("Times-Bold", 8)
        lga = member_data.get('lga', 'JOS NORTH').upper()
        c.drawString(52*mm, info_start_y-18*mm, lga)
        
        # Footer with holographic strip
        c.setFillColor(colors.HexColor('#16a34a'))
        c.rect(0, 0, card_width, 6*mm, fill=1)
        
        # Serial number and validity
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 5)
        serial_number = member_data.get('id_card_serial_number', 'SN-UNKNOWN')
        c.drawString(3*mm, 2*mm, f"S/N: {serial_number}")
        
        c.setFont("Helvetica", 5)
        reg_date = member_data.get('registration_date', datetime.now())
        if isinstance(reg_date, str):
            reg_date = datetime.fromisoformat(reg_date)
        
        c.drawString(3*mm, 4*mm, f"VALID NATIONWIDE • ISSUED: {reg_date.year}")
        
        # Slogan
        c.setFont("Helvetica-Bold", 6)
        slogan_text = "ARISE, IT'S YOUTH O'CLOCK!"
        text_width = c.stringWidth(slogan_text, "Helvetica-Bold", 6)
        c.drawString((card_width - text_width) / 2, 0.5*mm, slogan_text)
        
        # Enhanced security hologram corner with logo
        c.saveState()
        c.setFillColor(colors.HexColor('#fbbf24'))
        c.setFillAlpha(0.8)
        # Security triangle using path
        p = c.beginPath()
        p.moveTo(card_width-8*mm, card_height)
        p.lineTo(card_width, card_height)
        p.lineTo(card_width, card_height-8*mm)
        p.close()
        c.drawPath(p, fill=1)
        c.setFillColor(colors.black)
        c.setFillAlpha(1)
        c.setFont("Helvetica-Bold", 3)
        c.drawString(card_width-7*mm, card_height-2*mm, "SECURE")
        c.restoreState()
    
    def _generate_back_side(self, c, member_data, card_width, card_height):
        """Generate the back side of the ID card with specific terms and conditions"""
        from reportlab.lib.units import mm
        from reportlab.lib import colors
        
        # Background
        c.setFillColor(colors.HexColor('#f8fafc'))
        c.rect(0, 0, card_width, card_height, fill=1)
        
        # Enhanced watermark pattern
        c.saveState()
        c.setFillColor(colors.HexColor('#f1f5f9'))
        c.setFillAlpha(0.5)
        c.setFont("Helvetica-Bold", 10)
        c.rotate(-25)
        for i in range(-15, 20, 10):
            for j in range(-8, 12, 6):
                c.drawString(i*mm, j*mm, "ADYC")
        c.restoreState()
        
        # Header
        c.setFillColor(colors.HexColor('#16a34a'))
        c.rect(0, card_height-12*mm, card_width, 12*mm, fill=1)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(5*mm, card_height-7*mm, "AFRICAN DEMOCRATIC YOUTH CONGRESS")
        c.setFont("Helvetica-Bold", 7)
        c.drawString(5*mm, card_height-10*mm, "MEMBERSHIP TERMS & CONDITIONS")
        
        # Terms and conditions - Specific content as requested
        c.setFont("Times-Roman", 6)
        terms_y = card_height - 18*mm
        c.setFillColor(colors.black)
        
        terms = [
            "• This card is the property of ADYC and must be returned upon request.",
            "• Misuse of this card is prohibited and may result in membership termination.",
            "• Report lost or stolen cards immediately to ADYC administration.",
            "• This card grants access to ADYC programs and events nationwide.", 
            "• Valid for active members in good standing only."
        ]
        
        for i, term in enumerate(terms):
            c.drawString(3*mm, terms_y - (i * 3*mm), term)
        
        # Contact Information Section
        contact_y = terms_y - 18*mm
        c.setFillColor(colors.HexColor('#f97316'))
        c.setFont("Helvetica-Bold", 8)
        c.drawString(3*mm, contact_y, "CONTACT INFORMATION:")
        
        c.setFillColor(colors.black)
        c.setFont("Times-Roman", 7)
        c.drawString(3*mm, contact_y - 4*mm, "Phone: 08156257998")
        c.drawString(3*mm, contact_y - 8*mm, "Email: africandemocraticyouthcongress@gmail.com")
        
        # Footer with holographic design
        c.setFillColor(colors.HexColor('#059669'))
        c.rect(0, 0, card_width, 8*mm, fill=1)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 6)
        c.drawString(3*mm, 5*mm, "OFFICIAL MEMBERSHIP CARD")
        c.setFont("Helvetica", 4)
        c.drawString(3*mm, 3*mm, "WhatsApp: wa.me/c/2349156257998 | TikTok: @adyc676")
        c.drawString(3*mm, 1*mm, "www.adyc.org | Follow @ADYC_Official")
        
        # Security QR Code placeholder (enhanced)
        qr_size = 12*mm
        qr_x = card_width - qr_size - 3*mm
        qr_y = contact_y - 12*mm
        c.setFillColor(colors.HexColor('#e5e7eb'))
        c.rect(qr_x, qr_y, qr_size, qr_size, fill=1)
        c.setStrokeColor(colors.HexColor('#6b7280'))
        c.setLineWidth(0.5)
        c.rect(qr_x, qr_y, qr_size, qr_size, fill=0, stroke=1)
        
        # QR placeholder with security text
        c.setFillColor(colors.HexColor('#6b7280'))
        c.setFont("Helvetica-Bold", 4)
        c.drawString(qr_x+2*mm, qr_y+7*mm, "SECURITY")
        c.drawString(qr_x+2*mm, qr_y+5*mm, "QR CODE")
        c.drawString(qr_x+1.5*mm, qr_y+3*mm, "VERIFICATION")
        
        # Serial number on back
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 5)
        serial_number = member_data.get('id_card_serial_number', 'SN-UNKNOWN')
        c.drawString(qr_x, qr_y-3*mm, f"Serial: {serial_number}")

    def send_registration_email(self, member_data: Dict[str, Any]) -> bool:
        """Send registration confirmation email with ID card PDF attachment"""
        try:
            # Generate ID card PDF
            pdf_data = self.generate_id_card_pdf(member_data)
            
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = self.username
            msg['To'] = member_data['email']
            msg['Subject'] = "Welcome to ADYC - Your Membership Confirmation"
            
            # Email body
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="https://customer-assets.emergentagent.com/job_c6e56cf6-bfc9-4e7f-baab-fad031a53cd0/artifacts/wqccelzo_ADYC%20LOGO%202-1.jpg" 
                                 alt="ADYC Logo" style="width: 100px; height: 100px; margin-bottom: 20px;">
                            <h1 style="color: #f97316; margin: 0;">Welcome to ADYC!</h1>
                            <p style="font-size: 18px; color: #22c55e; font-weight: bold;">African Democratic Youth Congress</p>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <h2 style="color: #333; margin-top: 0;">Dear {member_data['full_name']},</h2>
                            
                            <p>Congratulations! Your registration with the African Democratic Youth Congress has been successfully completed.</p>
                            
                            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #f97316;">
                                <h3 style="margin-top: 0; color: #f97316;">Your Membership Details:</h3>
                                <p><strong>Member ID:</strong> {member_data['member_id']}</p>
                                <p><strong>Full Name:</strong> {member_data['full_name']}</p>
                                <p><strong>Email:</strong> {member_data['email']}</p>
                                <p><strong>State:</strong> {member_data['state']}</p>
                                <p><strong>Local Government Area:</strong> {member_data['lga']}</p>
                                <p><strong>Ward:</strong> {member_data['ward']}</p>
                                <p><strong>Gender:</strong> {member_data['gender']}</p>
                                <p><strong>Registration Date:</strong> {datetime.fromisoformat(member_data['registration_date']).strftime('%B %d, %Y') if isinstance(member_data['registration_date'], str) else member_data['registration_date'].strftime('%B %d, %Y')}</p>
                            </div>
                        </div>
                        
                        <div style="background-color: #22c55e; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                            <h3 style="margin-top: 0;">Your Official ADYC ID Card</h3>
                            <p>We've attached your official ADYC membership ID card as a PDF. Please keep this safe as it serves as proof of your membership.</p>
                            <p style="font-size: 16px; font-weight: bold;">📎 ADYC_ID_Card_{member_data['member_id']}.pdf</p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <h2 style="color: #f97316; font-style: italic;">"Arise, It's Youth O'Clock!"</h2>
                        </div>
                        
                        <div style="border-top: 2px solid #f97316; padding-top: 20px; text-align: center; color: #666;">
                            <p><strong>African Democratic Youth Congress (ADYC)</strong></p>
                            <p>Email: africandemocraticyouthcongress@gmail.com</p>
                            <p>Building a better Nigeria through youth empowerment and democratic participation.</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Plain text version
            text_body = f"""
            Welcome to ADYC - African Democratic Youth Congress!
            
            Dear {member_data['full_name']},
            
            Congratulations! Your registration has been successfully completed.
            
            Your Membership Details:
            - Member ID: {member_data['member_id']}
            - Full Name: {member_data['full_name']}
            - Email: {member_data['email']}
            - State: {member_data['state']}
            - LGA: {member_data['lga']}
            - Ward: {member_data['ward']}
            - Gender: {member_data['gender']}
            - Registration Date: {datetime.fromisoformat(member_data['registration_date']).strftime('%B %d, %Y') if isinstance(member_data['registration_date'], str) else member_data['registration_date'].strftime('%B %d, %Y')}
            
            Your official ADYC membership ID card has been attached as a PDF.
            
            "Arise, It's Youth O'Clock!"
            
            African Democratic Youth Congress (ADYC)
            Email: africandemocraticyouthcongress@gmail.com
            """
            
            # Attach HTML and text versions
            msg.attach(MIMEText(text_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            # Attach PDF
            pdf_attachment = MIMEApplication(pdf_data, _subtype="pdf")
            pdf_attachment.add_header('Content-Disposition', 'attachment', 
                                    filename=f"ADYC_ID_Card_{member_data['member_id']}.pdf")
            msg.attach(pdf_attachment)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)
            
            logger.info(f"Registration email sent successfully to {member_data['email']}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending registration email: {e}")
            return False

    def send_admin_notification_email(self, member_data: Dict[str, Any]) -> bool:
        """Send admin notification email when a new member registers"""
        try:
            # Generate ID card PDF for admin notification
            pdf_data = self.generate_id_card_pdf(member_data)
            
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = self.username
            msg['To'] = self.username  # Send to ADYC admin email
            msg['Subject'] = f"🔔 New ADYC Member Registration - {member_data['full_name']}"
            
            # Email body - HTML format
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="https://customer-assets.emergentagent.com/job_c6e56cf6-bfc9-4e7f-baab-fad031a53cd0/artifacts/wqczelzo_ADYC%20LOGO%202-1.jpg" 
                                 alt="ADYC Logo" style="width: 80px; height: 80px; margin-bottom: 15px;">
                            <h1 style="color: #f97316; margin: 0;">New Member Registration</h1>
                            <p style="font-size: 16px; color: #22c55e; font-weight: bold;">African Democratic Youth Congress</p>
                        </div>
                        
                        <div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                            <h2 style="color: #92400e; margin-top: 0;">🎉 New Member Alert!</h2>
                            <p style="color: #92400e; font-size: 16px;">A new member has successfully registered with ADYC. Please find their details below:</p>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <h3 style="color: #f97316; margin-top: 0;">Member Information:</h3>
                            
                            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Full Name:</strong> <span style="color: #1f2937;">{member_data['full_name']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Member ID:</strong> <span style="color: #f97316; font-weight: bold;">{member_data['member_id']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Email:</strong> <span style="color: #1f2937;">{member_data['email']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Gender:</strong> <span style="color: #1f2937;">{member_data['gender']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Date of Birth:</strong> <span style="color: #1f2937;">{member_data['dob']}</span></p>
                            </div>
                            
                            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                                <h4 style="color: #22c55e; margin-top: 0;">📍 Location Details:</h4>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">State:</strong> <span style="color: #1f2937;">{member_data['state']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Local Government Area (LGA):</strong> <span style="color: #1f2937;">{member_data['lga']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Ward:</strong> <span style="color: #1f2937;">{member_data['ward']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Country:</strong> <span style="color: #1f2937;">{member_data['country']}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #374151;">Address:</strong> <span style="color: #1f2937;">{member_data['address']}</span></p>
                            </div>
                            
                            <div style="background-color: #e0f2fe; padding: 15px; border-radius: 5px; border-left: 4px solid #0277bd;">
                                <p style="margin: 5px 0;"><strong style="color: #01579b;">Registration Date:</strong> <span style="color: #01579b;">{datetime.fromisoformat(member_data['registration_date']).strftime('%B %d, %Y at %I:%M %p') if isinstance(member_data['registration_date'], str) else member_data['registration_date'].strftime('%B %d, %Y at %I:%M %p')}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #01579b;">Marital Status:</strong> <span style="color: #01579b;">{member_data.get('marital_status', 'Not specified')}</span></p>
                                <p style="margin: 5px 0;"><strong style="color: #01579b;">Language:</strong> <span style="color: #01579b;">{member_data.get('language', 'Not specified')}</span></p>
                            </div>
                        </div>
                        
                        <div style="background-color: #22c55e; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                            <h3 style="margin-top: 0;">📎 ID Card Attached</h3>
                            <p>The member's official ADYC ID card has been generated and attached to this email for your records.</p>
                            <p style="font-size: 14px; font-weight: bold;">ADYC_ID_Card_{member_data['member_id']}.pdf</p>
                        </div>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                            <h4 style="color: #374151; margin-top: 0;">📧 Next Steps:</h4>
                            <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
                                <li>Member has been automatically sent their registration confirmation email</li>
                                <li>Their ID card PDF has been attached to their confirmation email</li>
                                <li>Member information has been stored in the database</li>
                                <li>You may want to follow up with a welcome call or additional orientation materials</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <h2 style="color: #f97316; font-style: italic;">"Arise, It's Youth O'Clock!"</h2>
                        </div>
                        
                        <div style="border-top: 2px solid #f97316; padding-top: 20px; text-align: center; color: #666;">
                            <p><strong>ADYC Admin Notification System</strong></p>
                            <p>This is an automated notification. Please do not reply to this email.</p>
                            <p style="font-size: 12px;">African Democratic Youth Congress - Building a better Nigeria through youth empowerment.</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Plain text version for fallback
            text_body = f"""
            NEW ADYC MEMBER REGISTRATION NOTIFICATION
            
            A new member has registered with the African Democratic Youth Congress.
            
            MEMBER INFORMATION:
            - Full Name: {member_data['full_name']}
            - Member ID: {member_data['member_id']}
            - Email: {member_data['email']}
            - Gender: {member_data['gender']}
            - Date of Birth: {member_data['dob']}
            
            LOCATION DETAILS:
            - State: {member_data['state']}
            - LGA: {member_data['lga']}
            - Ward: {member_data['ward']}
            - Country: {member_data['country']}
            - Address: {member_data['address']}
            
            REGISTRATION DETAILS:
            - Registration Date: {datetime.fromisoformat(member_data['registration_date']).strftime('%B %d, %Y at %I:%M %p') if isinstance(member_data['registration_date'], str) else member_data['registration_date'].strftime('%B %d, %Y at %I:%M %p')}
            - Marital Status: {member_data.get('marital_status', 'Not specified')}
            - Language: {member_data.get('language', 'Not specified')}
            
            The member's ID card PDF has been attached to this email for your records.
            The member has also been sent their registration confirmation email automatically.
            
            "Arise, It's Youth O'Clock!"
            
            ADYC Admin Notification System
            """
            
            # Attach HTML and text versions
            msg.attach(MIMEText(text_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            # Attach PDF
            pdf_attachment = MIMEApplication(pdf_data, _subtype="pdf")
            pdf_attachment.add_header('Content-Disposition', 'attachment', 
                                    filename=f"ADYC_ID_Card_{member_data['member_id']}.pdf")
            msg.attach(pdf_attachment)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)
            
            logger.info(f"Admin notification email sent successfully for new member: {member_data['full_name']} ({member_data['member_id']})")
            return True
            
        except Exception as e:
            logger.error(f"Error sending admin notification email: {e}")
            return False

    def send_contact_notification(self, contact_data: Dict[str, Any]) -> bool:
        """Send notification email for contact form submissions"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.username
            msg['To'] = self.username  # Send to ADYC email
            msg['Subject'] = "New Contact Form Submission - ADYC Website"
            
            body = f"""
            New contact form submission received:
            
            Name: {contact_data.get('name', 'N/A')}
            Email: {contact_data.get('email', 'N/A')}
            Message: {contact_data.get('message', 'N/A')}
            
            Submitted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending contact notification: {e}")
            return False

# Create global email service instance (lazy initialization)
email_service = None

def get_email_service():
    """Get email service instance with lazy initialization"""
    global email_service
    if email_service is None:
        email_service = EmailService()
    return email_service