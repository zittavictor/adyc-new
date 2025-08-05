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

    def generate_id_card_pdf(self, member_data: Dict[str, Any]) -> bytes:
        """Generate ID card PDF with ADYC logo and member information"""
        try:
            # Create a BytesIO buffer for the PDF
            buffer = BytesIO()
            
            # Create PDF with custom page size (ID card dimensions)
            # Standard ID card size: 85.6mm x 54mm (credit card size)
            page_width = 85.6 * mm
            page_height = 54 * mm
            
            doc = SimpleDocTemplate(buffer, pagesize=(page_width, page_height),
                                  topMargin=2*mm, bottomMargin=2*mm, 
                                  leftMargin=2*mm, rightMargin=2*mm)
            
            # Create the PDF using canvas for more control
            c = canvas.Canvas(buffer, pagesize=(page_width, page_height))
            
            # Background color
            c.setFillColor(colors.white)
            c.rect(0, 0, page_width, page_height, fill=1)
            
            # Header section with ADYC branding
            header_height = 15*mm
            c.setFillColor(colors.HexColor('#f97316'))  # Orange color
            c.rect(0, page_height - header_height, page_width, header_height, fill=1)
            
            # ADYC Logo - Download and embed the logo
            try:
                logo_url = "https://customer-assets.emergentagent.com/job_c6e56cf6-bfc9-4e7f-baab-fad031a53cd0/artifacts/wqccelzo_ADYC%20LOGO%202-1.jpg"
                response = requests.get(logo_url)
                if response.status_code == 200:
                    logo_image = PILImage.open(BytesIO(response.content))
                    logo_image_reader = ImageReader(BytesIO(response.content))
                    
                    # Place logo in top left
                    logo_size = 10*mm
                    c.drawImage(logo_image_reader, 2*mm, page_height - 13*mm, 
                              width=logo_size, height=logo_size, mask='auto')
            except Exception as e:
                logger.error(f"Error loading logo: {e}")
                # Fallback: Add text logo
                c.setFillColor(colors.white)
                c.setFont("Helvetica-Bold", 8)
                c.drawString(2*mm, page_height - 8*mm, "ADYC")
            
            # Header text
            c.setFillColor(colors.white)
            c.setFont("Helvetica-Bold", 8)
            header_text = "AFRICAN DEMOCRATIC YOUTH CONGRESS"
            text_width = c.stringWidth(header_text, "Helvetica-Bold", 8)
            c.drawString((page_width - text_width) / 2, page_height - 6*mm, header_text)
            
            c.setFont("Helvetica", 6)
            subheader_text = "MEMBERSHIP ID CARD"
            text_width = c.stringWidth(subheader_text, "Helvetica", 6)
            c.drawString((page_width - text_width) / 2, page_height - 9*mm, subheader_text)
            
            # Member photo section
            photo_x = 5*mm
            photo_y = page_height - 35*mm
            photo_width = 18*mm
            photo_height = 20*mm
            
            # Draw photo placeholder or actual photo
            if member_data.get('passport'):
                try:
                    # Decode base64 image
                    if member_data['passport'].startswith('data:image'):
                        photo_data = member_data['passport'].split(',')[1]
                    else:
                        photo_data = member_data['passport']
                    
                    photo_bytes = base64.b64decode(photo_data)
                    photo_image = PILImage.open(BytesIO(photo_bytes))
                    photo_image_reader = ImageReader(BytesIO(photo_bytes))
                    
                    c.drawImage(photo_image_reader, photo_x, photo_y, 
                              width=photo_width, height=photo_height, mask='auto')
                except Exception as e:
                    logger.error(f"Error processing member photo: {e}")
                    # Fallback: Draw placeholder
                    c.setFillColor(colors.lightgrey)
                    c.rect(photo_x, photo_y, photo_width, photo_height, fill=1)
                    c.setFillColor(colors.black)
                    c.setFont("Helvetica", 6)
                    photo_text = "PHOTO"
                    text_width = c.stringWidth(photo_text, "Helvetica", 6)
                    c.drawString(photo_x + (photo_width - text_width) / 2, photo_y + photo_height/2, photo_text)
            else:
                # Draw placeholder
                c.setFillColor(colors.lightgrey)
                c.rect(photo_x, photo_y, photo_width, photo_height, fill=1)
                c.setFillColor(colors.black)
                c.setFont("Helvetica", 6)
                photo_text = "PHOTO"
                text_width = c.stringWidth(photo_text, "Helvetica", 6)
                c.drawString(photo_x + (photo_width - text_width) / 2, photo_y + photo_height/2, photo_text)
            
            # Member information section
            info_x = 26*mm
            info_y = page_height - 20*mm
            
            c.setFillColor(colors.black)
            c.setFont("Helvetica-Bold", 7)
            
            # Name
            c.drawString(info_x, info_y, "NAME:")
            c.setFont("Helvetica", 6)
            c.drawString(info_x, info_y - 3*mm, member_data.get('full_name', '').upper())
            
            # Member ID
            c.setFont("Helvetica-Bold", 7)
            c.drawString(info_x, info_y - 7*mm, "MEMBER ID:")
            c.setFont("Helvetica", 6)
            c.drawString(info_x, info_y - 10*mm, member_data.get('member_id', ''))
            
            # Email
            c.setFont("Helvetica-Bold", 7)
            c.drawString(info_x, info_y - 14*mm, "EMAIL:")
            c.setFont("Helvetica", 5)
            c.drawString(info_x, info_y - 17*mm, member_data.get('email', ''))
            
            # Right column information
            right_x = 55*mm
            
            c.setFont("Helvetica-Bold", 7)
            c.drawString(right_x, info_y, "STATE:")
            c.setFont("Helvetica", 6)
            c.drawString(right_x, info_y - 3*mm, member_data.get('state', '').upper())
            
            c.setFont("Helvetica-Bold", 7)
            c.drawString(right_x, info_y - 7*mm, "LGA:")
            c.setFont("Helvetica", 6)
            c.drawString(right_x, info_y - 10*mm, member_data.get('lga', '').upper())
            
            c.setFont("Helvetica-Bold", 7)
            c.drawString(right_x, info_y - 14*mm, "WARD:")
            c.setFont("Helvetica", 6)
            c.drawString(right_x, info_y - 17*mm, member_data.get('ward', '').upper())
            
            # Gender and Country
            c.setFont("Helvetica-Bold", 7)
            c.drawString(info_x, info_y - 21*mm, "GENDER:")
            c.setFont("Helvetica", 6)
            c.drawString(info_x, info_y - 24*mm, member_data.get('gender', '').upper())
            
            c.setFont("Helvetica-Bold", 7)
            c.drawString(right_x, info_y - 21*mm, "COUNTRY:")
            c.setFont("Helvetica", 6)
            c.drawString(right_x, info_y - 24*mm, member_data.get('country', '').upper())
            
            # Footer section
            footer_height = 8*mm
            c.setFillColor(colors.HexColor('#22c55e'))  # Green color
            c.rect(0, 0, page_width, footer_height, fill=1)
            
            # Footer text
            c.setFillColor(colors.white)
            c.setFont("Helvetica", 5)
            reg_date_raw = member_data.get('registration_date', datetime.now())
            if isinstance(reg_date_raw, str):
                reg_date = datetime.fromisoformat(reg_date_raw)
            else:
                reg_date = reg_date_raw
            footer_text = f"VALID NATIONWIDE • ISSUED: {reg_date.year}"
            text_width = c.stringWidth(footer_text, "Helvetica", 5)
            c.drawString((page_width - text_width) / 2, 3*mm, footer_text)
            
            # Slogan at bottom
            c.setFont("Helvetica-Bold", 6)
            slogan_text = "ARISE, IT'S YOUTH O'CLOCK!"
            text_width = c.stringWidth(slogan_text, "Helvetica-Bold", 6)
            c.drawString((page_width - text_width) / 2, 5.5*mm, slogan_text)
            
            # Save the PDF
            c.save()
            
            buffer.seek(0)
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Error generating ID card PDF: {e}")
            raise

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