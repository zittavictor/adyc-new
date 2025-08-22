import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../lib/supabase';
import EmailService from '../lib/email';
import { ApiResponse } from '../types';
import { z } from 'zod';

const adminNotificationSchema = z.object({
  member_id: z.string().min(1)
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
    const validation = adminNotificationSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors
      } as ApiResponse);
    }

    const { member_id } = validation.data;
    const supabaseService = new SupabaseService();
    const member = await supabaseService.getMemberById(member_id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      } as ApiResponse);
    }

    const emailService = new EmailService();
    const success = await emailService.sendAdminNotificationEmail(member);

    if (success) {
      res.status(200).json({
        success: true,
        message: 'Admin notification email sent successfully',
        data: { member_id }
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send admin notification email'
      } as ApiResponse);
    }

  } catch (error) {
    console.error('Admin notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send admin notification email',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}