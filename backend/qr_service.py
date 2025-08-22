import os
import logging
import qrcode
import io
import base64
from typing import Dict, Any, Optional
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class QRCodeService:
    def __init__(self):
        self.frontend_url = os.getenv('REACT_APP_FRONTEND_URL', 'https://secure-id-creator.preview.emergentagent.com')
        
    def generate_member_qr(self, member_id: str, member_name: str = None) -> Dict[str, Any]:
        """
        Generate QR code for member profile verification
        
        Args:
            member_id: Unique member identifier
            member_name: Optional member name for enhanced QR code
            
        Returns:
            Dict containing QR code data (base64 image and verification URL)
        """
        try:
            # Create member verification URL
            verification_url = f"{self.frontend_url}/verify/{member_id}"
            
            # Create QR code instance with custom settings
            qr = qrcode.QRCode(
                version=1,  # Controls size (1 is smallest)
                error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for better scanning
                box_size=10,  # Size of each box in pixels
                border=4,  # Minimum border size
            )
            
            # Add data and generate QR code
            qr.add_data(verification_url)
            qr.make(fit=True)
            
            # Create QR code image with custom colors
            qr_img = qr.make_image(
                fill_color="#FF6600",  # ADYC orange
                back_color="white"
            )
            
            # Convert to RGB if not already
            if qr_img.mode != 'RGB':
                qr_img = qr_img.convert('RGB')
            
            # Enhanced QR code with ADYC branding
            enhanced_qr = self._enhance_qr_code(qr_img, member_id, member_name)
            
            # Convert to base64 for easy storage/transmission
            buffer = io.BytesIO()
            enhanced_qr.save(buffer, format='PNG', quality=95)
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            logger.info(f"Successfully generated QR code for member: {member_id}")
            
            return {
                'qr_code_base64': img_base64,
                'verification_url': verification_url,
                'member_id': member_id,
                'qr_type': 'member_verification'
            }
            
        except Exception as e:
            logger.error(f"Error generating QR code for member {member_id}: {e}")
            raise ValueError(f"Failed to generate QR code: {str(e)}")
    
    def _enhance_qr_code(self, qr_img: Image.Image, member_id: str, member_name: str = None) -> Image.Image:
        """
        Enhance QR code with ADYC branding and member information
        
        Args:
            qr_img: Base QR code image
            member_id: Member ID to display
            member_name: Optional member name
            
        Returns:
            Enhanced QR code image
        """
        try:
            # Create larger canvas for branding
            qr_width, qr_height = qr_img.size
            canvas_width = qr_width + 100
            canvas_height = qr_height + 120
            
            # Create new image with white background
            canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
            
            # Paste QR code in center
            qr_x = (canvas_width - qr_width) // 2
            qr_y = 60  # Leave space for header
            canvas.paste(qr_img, (qr_x, qr_y))
            
            # Add text elements
            draw = ImageDraw.Draw(canvas)
            
            # Try to load a font, fallback to default if not available
            try:
                # Use default font sizes
                title_font = ImageFont.load_default()
                subtitle_font = ImageFont.load_default()
                info_font = ImageFont.load_default()
            except:
                # Fallback to PIL's default font
                title_font = ImageFont.load_default()
                subtitle_font = ImageFont.load_default()
                info_font = ImageFont.load_default()
            
            # Add ADYC header
            title_text = "ADYC MEMBER"
            title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
            title_width = title_bbox[2] - title_bbox[0]
            title_x = (canvas_width - title_width) // 2
            draw.text((title_x, 15), title_text, fill="#FF6600", font=title_font)
            
            # Add member ID below QR code
            id_text = f"ID: {member_id}"
            id_bbox = draw.textbbox((0, 0), id_text, font=subtitle_font)
            id_width = id_bbox[2] - id_bbox[0]
            id_x = (canvas_width - id_width) // 2
            draw.text((id_x, qr_y + qr_height + 10), id_text, fill="#333333", font=subtitle_font)
            
            # Add member name if provided
            if member_name:
                name_text = member_name[:30] + "..." if len(member_name) > 30 else member_name
                name_bbox = draw.textbbox((0, 0), name_text, font=info_font)
                name_width = name_bbox[2] - name_bbox[0]
                name_x = (canvas_width - name_width) // 2
                draw.text((name_x, qr_y + qr_height + 30), name_text, fill="#666666", font=info_font)
            
            # Add verification instruction
            instruction_text = "Scan for Verification"
            instruction_bbox = draw.textbbox((0, 0), instruction_text, font=info_font)
            instruction_width = instruction_bbox[2] - instruction_bbox[0]
            instruction_x = (canvas_width - instruction_width) // 2
            instruction_y = canvas_height - 25
            draw.text((instruction_x, instruction_y), instruction_text, fill="#999999", font=info_font)
            
            # Add subtle border
            border_color = "#E0E0E0"
            draw.rectangle([(0, 0), (canvas_width-1, canvas_height-1)], outline=border_color, width=2)
            
            return canvas
            
        except Exception as e:
            logger.warning(f"Error enhancing QR code: {e}, returning basic QR code")
            # Return basic QR code if enhancement fails
            return qr_img
    
    def generate_event_qr(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate QR code for event information
        
        Args:
            event_data: Event information dictionary
            
        Returns:
            Dict containing QR code data
        """
        try:
            # Create event info URL or JSON data
            event_id = event_data.get('id', 'unknown')
            event_url = f"{self.frontend_url}/events/{event_id}"
            
            # Create QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=8,
                border=4,
            )
            
            qr.add_data(event_url)
            qr.make(fit=True)
            
            qr_img = qr.make_image(fill_color="#2E8B57", back_color="white")  # ADYC green
            
            # Convert to base64
            buffer = io.BytesIO()
            qr_img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            logger.info(f"Successfully generated event QR code: {event_id}")
            
            return {
                'qr_code_base64': img_base64,
                'event_url': event_url,
                'event_id': event_id,
                'qr_type': 'event_info'
            }
            
        except Exception as e:
            logger.error(f"Error generating event QR code: {e}")
            raise ValueError(f"Failed to generate event QR code: {str(e)}")

# Global instance
_qr_service = None

def get_qr_service() -> QRCodeService:
    """Get the global QR code service instance"""
    global _qr_service
    if _qr_service is None:
        _qr_service = QRCodeService()
    return _qr_service