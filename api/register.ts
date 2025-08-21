import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../lib/supabase';
import EmailService from '../lib/email';
import CloudinaryService from '../lib/cloudinary';
import { MemberRegistration, MemberRegistrationCreate, ApiResponse } from '../types';
import { z } from 'zod';

const memberRegistrationSchema = z.object({
  email: z.string().email(),
  passport: z.string().min(1),
  full_name: z.string().min(1),
  dob: z.string().min(1),
  ward: z.string().min(1),
  lga: z.string().min(1),
  state: z.string().min(1),
  country: z.string().optional().default('Nigeria'),
  address: z.string().min(1),
  language: z.string().optional().default(''),
  marital_status: z.string().optional().default(''),
  gender: z.string().min(1)
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
    const validation = memberRegistrationSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors
      } as ApiResponse);
    }

    const memberData = validation.data;
    const supabaseService = new SupabaseService();
    const cloudinaryService = new CloudinaryService();
    const emailService = new EmailService();

    // First, upload photo to Cloudinary
    const tempMemberId = `temp_${crypto.randomUUID().slice(0, 8)}`;
    const photoResult = await cloudinaryService.uploadMemberPhoto(
      memberData.passport,
      tempMemberId
    );

    // Replace base64 passport with Cloudinary URL
    const memberDataWithPhoto = {
      ...memberData,
      passport: photoResult.url
    };

    // Create member using Supabase service
    const result = await supabaseService.createMember(memberDataWithPhoto);

    // Update Cloudinary photo with actual member_id
    if (result.member_id) {
      try {
        const finalPhotoResult = await cloudinaryService.uploadMemberPhoto(
          memberData.passport,
          result.member_id
        );
        
        await supabaseService.updateMemberPhoto(
          result.member_id,
          finalPhotoResult.url,
          finalPhotoResult.public_id
        );
        
        result.passport = finalPhotoResult.url;
        
        // Clean up temporary photo
        await cloudinaryService.deleteMemberPhoto(photoResult.public_id);
      } catch (error) {
        console.warn('Error updating photo with actual member_id:', error);
      }
    }

    // Send registration email in background (don't await to avoid timeout)
    emailService.sendRegistrationEmail(result as MemberRegistration).catch(error => {
      console.error('Error sending registration email:', error);
    });

    // Send admin notification email in background
    emailService.sendAdminNotificationEmail(result as MemberRegistration).catch(error => {
      console.error('Error sending admin notification email:', error);
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Member registered successfully'
    } as ApiResponse<MemberRegistration>);

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.message.includes('Email already registered')) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}