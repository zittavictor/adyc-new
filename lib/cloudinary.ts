import { v2 as cloudinary } from 'cloudinary';
import { PhotoUploadResponse } from '../types';

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary configuration');
    }
  }

  async uploadMemberPhoto(base64Image: string, memberId: string): Promise<PhotoUploadResponse> {
    try {
      // Remove data URL prefix if present
      if (base64Image.startsWith('data:image')) {
        base64Image = base64Image.split(',')[1];
      }

      // Upload directly to Cloudinary with transformations
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(
          `data:image/jpeg;base64,${base64Image}`,
          {
            public_id: `adyc/members/${memberId}`,
            folder: 'adyc/members',
            resource_type: 'image',
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face' },
              { quality: 'auto:good' },
              { format: 'jpg' }
            ],
            tags: ['member_photo', 'adyc'],
            overwrite: true
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      };
    } catch (error) {
      throw new Error(`Failed to upload photo: ${error}`);
    }
  }

  async deleteMemberPhoto(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  getPhotoUrl(publicId: string, transformation?: Record<string, any>): string {
    try {
      const defaultTransformation = {
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        format: 'jpg'
      };

      const finalTransformation = { ...defaultTransformation, ...transformation };

      return cloudinary.url(publicId, finalTransformation);
    } catch (error) {
      throw new Error(`Failed to generate photo URL: ${error}`);
    }
  }
}

export default CloudinaryService;