import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../lib/supabase';
import EmailService from '../../lib/email';
import AuthService from '../../lib/auth';
import { ApiResponse, MemberRegistration } from '../../types';
import { z } from 'zod';

const setupAdminSchema = z.object({
  setup_key: z.string(),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

const testEmailSchema = z.object({
  test_email: z.string().email()
});

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

  const { action } = req.query;
  
  try {
    const supabaseService = new SupabaseService();

    // API Status Check
    if (action === 'status' && req.method === 'GET') {
      // Simple status check without database test
      res.status(200).json({
        success: true,
        data: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'available',
          version: '1.0.0'
        },
        message: 'API is operational'
      } as ApiResponse);
      return;
    }

    // Admin Setup
    if (action === 'setup-admin' && req.method === 'POST') {
      const validation = setupAdminSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        } as ApiResponse);
        return;
      }

      const { setup_key, username, email, password } = validation.data;
      
      if (setup_key !== 'adyc-setup-2025-secure') {
        res.status(403).json({
          success: false,
          error: 'Invalid setup key'
        } as ApiResponse);
        return;
      }

      // Check if admin already exists
      const existingAdmin = await supabaseService.getAdminUser(username);
      if (existingAdmin) {
        res.status(409).json({
          success: false,
          error: 'Admin user already exists'
        } as ApiResponse);
        return;
      }

      const authService = new AuthService();
      const hashedPassword = await authService.hashPassword(password);

      const adminData = {
        username,
        email,
        password_hash: hashedPassword,
        is_active: true,
        created_at: new Date().toISOString()
      };

      const createdAdmin = await supabaseService.createAdminUser(adminData);

      res.status(201).json({
        success: true,
        data: {
          id: createdAdmin.id,
          username: createdAdmin.username,
          email: createdAdmin.email,
          is_active: createdAdmin.is_active
        },
        message: 'Admin user created successfully'
      } as ApiResponse);
      return;
    }

    // Test Email
    if (action === 'test-email' && req.method === 'POST') {
      const validation = testEmailSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid email address'
        } as ApiResponse);
        return;
      }

      const emailService = new EmailService();
      
      // Create a test member data for email testing
      const testMemberData: MemberRegistration = {
        id: 'test-id',
        member_id: 'TEST-2025-123456',
        full_name: 'Test Member',
        email: validation.data.test_email,
        passport: 'https://example.com/test-photo.jpg', // Add required passport field
        dob: '1990-01-01',
        gender: 'male' as const,
        state: 'Lagos',
        lga: 'Ikeja',
        ward: 'Ward 1',
        country: 'Nigeria',
        address: 'Test Address',
        registration_date: new Date().toISOString(),
        id_card_generated: false,
        id_card_serial_number: 'TEST123'
      };

      const emailSent = await emailService.sendRegistrationEmail(testMemberData);

      if (emailSent) {
        res.status(200).json({
          success: true,
          message: 'Test email sent successfully'
        } as ApiResponse);
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to send test email'
        } as ApiResponse);
      }
      return;
    }

    // Send Admin Notification
    if (action === 'admin-notification' && req.method === 'POST') {
      const validation = adminNotificationSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid member ID'
        } as ApiResponse);
        return;
      }

      const member = await supabaseService.getMemberById(validation.data.member_id);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        } as ApiResponse);
        return;
      }

      const emailService = new EmailService();
      const emailSent = await emailService.sendAdminNotificationEmail(member);

      if (emailSent) {
        res.status(200).json({
          success: true,
          message: 'Admin notification sent successfully'
        } as ApiResponse);
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to send admin notification'
        } as ApiResponse);
      }
      return;
    }

    // Member Verification
    if (action === 'verify' && req.method === 'GET') {
      const { memberId } = req.query;
      
      if (!memberId) {
        res.status(400).json({
          success: false,
          error: 'Member ID is required'
        } as ApiResponse);
        return;
      }

      const member = await supabaseService.getMemberById(memberId as string);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        } as ApiResponse);
        return;
      }

      // Log verification activity
      await supabaseService.logActivity(
        member.email,
        'MEMBER_VERIFICATION',
        'public',
        member.id,
        { member_id: member.member_id, verified_at: new Date().toISOString() }
      );

      res.status(200).json({
        success: true,
        data: {
          member_id: member.member_id,
          full_name: member.full_name,
          state: member.state,
          lga: member.lga,
          registration_date: member.registration_date,
          verified: true
        },
        message: 'Member verified successfully'
      } as ApiResponse);
      return;
    }

    // Default response for unknown actions
    res.status(404).json({
      success: false,
      error: 'Utility action not found'
    } as ApiResponse);

  } catch (error) {
    console.error('Utilities API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}