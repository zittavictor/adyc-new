import os
import logging
import base64
import io
from typing import Dict, Any, Optional
import cloudinary
import cloudinary.uploader
from PIL import Image
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class CloudinaryService:
    def __init__(self):
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
            api_key=os.getenv('CLOUDINARY_API_KEY'),
            api_secret=os.getenv('CLOUDINARY_API_SECRET'),
            secure=True
        )
        
        # Validate configuration
        if not all([
            os.getenv('CLOUDINARY_CLOUD_NAME'),
            os.getenv('CLOUDINARY_API_KEY'),
            os.getenv('CLOUDINARY_API_SECRET')
        ]):
            raise ValueError("Missing Cloudinary configuration. Please check environment variables.")
    
    async def upload_member_photo(self, base64_image: str, member_id: str) -> Dict[str, Any]:
        """
        Upload member photo to Cloudinary from base64 string
        
        Args:
            base64_image: Base64 encoded image string (with or without data URL prefix)
            member_id: Unique member identifier
            
        Returns:
            Dict containing Cloudinary response with URL, public_id, etc.
        """
        try:
            # Remove data URL prefix if present (data:image/jpeg;base64,)
            if base64_image.startswith('data:image'):
                base64_image = base64_image.split(',')[1]
            
            # Decode base64 to bytes
            image_bytes = base64.b64decode(base64_image)
            
            # Open image with PIL to validate and potentially resize
            image = Image.open(io.BytesIO(image_bytes))
            
            # Resize image if too large (max 1MB for efficiency)
            max_size = (800, 800)  # Max dimensions
            if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Convert back to bytes
                img_buffer = io.BytesIO()
                # Preserve original format if possible, else use JPEG
                format_type = image.format if image.format in ['JPEG', 'PNG'] else 'JPEG'
                image.save(img_buffer, format=format_type, quality=85)
                image_bytes = img_buffer.getvalue()
            
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image_bytes,
                public_id=f"adyc/members/{member_id}",
                folder="adyc/members",
                resource_type="image",
                transformation=[
                    {'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'},
                    {'quality': 'auto'},
                    {'format': 'jpg'}
                ],
                tags=['member_photo', 'adyc'],
                overwrite=True
            )
            
            logger.info(f"Successfully uploaded member photo for {member_id}: {upload_result.get('public_id')}")
            return {
                'url': upload_result['secure_url'],
                'public_id': upload_result['public_id'],
                'width': upload_result.get('width'),
                'height': upload_result.get('height'),
                'format': upload_result.get('format'),
                'bytes': upload_result.get('bytes')
            }
            
        except Exception as e:
            logger.error(f"Error uploading member photo for {member_id}: {e}")
            raise ValueError(f"Failed to upload photo: {str(e)}")
    
    async def delete_member_photo(self, public_id: str) -> bool:
        """
        Delete member photo from Cloudinary
        
        Args:
            public_id: Cloudinary public_id of the image
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            success = result.get('result') == 'ok'
            
            if success:
                logger.info(f"Successfully deleted photo: {public_id}")
            else:
                logger.warning(f"Failed to delete photo: {public_id}, result: {result}")
                
            return success
            
        except Exception as e:
            logger.error(f"Error deleting photo {public_id}: {e}")
            return False
    
    async def get_photo_url(self, public_id: str, transformation: Optional[Dict] = None) -> str:
        """
        Get optimized URL for a photo with optional transformations
        
        Args:
            public_id: Cloudinary public_id of the image
            transformation: Optional transformation parameters
            
        Returns:
            str: Cloudinary URL with transformations
        """
        try:
            # Default transformation for member photos
            default_transformation = {
                'width': 300,
                'height': 300,
                'crop': 'fill',
                'gravity': 'face',
                'quality': 'auto',
                'format': 'jpg'
            }
            
            # Merge with custom transformation if provided
            if transformation:
                default_transformation.update(transformation)
            
            # Generate URL with transformation
            url = cloudinary.CloudinaryImage(public_id).build_url(**default_transformation)
            
            return url
            
        except Exception as e:
            logger.error(f"Error generating photo URL for {public_id}: {e}")
            raise ValueError(f"Failed to generate photo URL: {str(e)}")

# Global instance
_cloudinary_service = None

def get_cloudinary_service() -> CloudinaryService:
    """Get the global Cloudinary service instance"""
    global _cloudinary_service
    if _cloudinary_service is None:
        _cloudinary_service = CloudinaryService()
    return _cloudinary_service