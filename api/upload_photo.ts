import { VercelRequest, VercelResponse } from '@vercel/node';
import CloudinaryService from '../lib/cloudinary';
import { PhotoUploadResponse, ApiResponse } from '../types';
import { z } from 'zod';

const photoUploadSchema = z.object({
  member_id: z.string().min(1),
  base64_image: z.string().min(1)
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    } as ApiResponse);
  }

  try {
    const validation = photoUploadSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors
      } as ApiResponse);
    }

    const { member_id, base64_image } = validation.data;
    const cloudinaryService = new CloudinaryService();

    const photoResult = await cloudinaryService.uploadMemberPhoto(base64_image, member_id);

    res.status(200).json({
      success: true,
      data: photoResult,
      message: 'Photo uploaded successfully'
    } as ApiResponse<PhotoUploadResponse>);

  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload photo',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}