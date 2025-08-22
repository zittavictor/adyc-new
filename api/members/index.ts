import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../lib/supabase';
import EmailService from '../../lib/email';
import QRCodeService from '../../lib/qr';
import { MemberRegistration, ApiResponse } from '../../types';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const memberRegistrationSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  dob: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  state: z.string().min(1),
  lga: z.string().min(1),
  ward: z.string().min(1),
  country: z.string().min(1),
  address: z.string().min(1),
  marital_status: z.string().optional(),
  language: z.string().optional(),
  photo_url: z.string().optional(),
  photo_public_id: z.string().optional()
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

  const { memberId, action } = req.query;
  
  try {
    const supabaseService = new SupabaseService();

    // Member Registration
    if (req.method === 'POST' && !memberId) {
      const validation = memberRegistrationSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        } as ApiResponse);
        return;
      }

      const memberData = validation.data;
      
      // Check for existing email
      const existingMember = await supabaseService.getMemberById(memberData.email);
      if (existingMember) {
        res.status(409).json({
          success: false,
          error: 'Member with this email already exists'
        } as ApiResponse);
        return;
      }

      // Generate member ID and serial number
      const currentYear = new Date().getFullYear();
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const member_id = `ADYC-${currentYear}-${randomId}`;
      const serial_number = uuidv4().substr(0, 8).toUpperCase();

      const registrationData: MemberRegistration = {
        ...memberData,
        id: uuidv4(),
        member_id,
        passport: memberData.photo_url || '', // Add required passport field
        id_card_serial_number: serial_number,
        registration_date: new Date().toISOString(),
        id_card_generated: false
      };

      const createdMember = await supabaseService.createMember(registrationData);

      // Log activity
      await supabaseService.logActivity(
        memberData.email,
        'MEMBER_REGISTRATION',
        'member',
        createdMember.id,
        { member_id: member_id }
      );

      // Send emails in background (don't wait for completion)
      const emailService = new EmailService();
      emailService.sendRegistrationEmail(createdMember).catch(console.error);
      emailService.sendAdminNotificationEmail(createdMember).catch(console.error);

      res.status(201).json({
        success: true,
        data: createdMember,
        message: 'Member registered successfully'
      } as ApiResponse<MemberRegistration>);
      return;
    }

    // Get all members
    if (req.method === 'GET' && !memberId) {
      const members = await supabaseService.getMembers();
      res.status(200).json({
        success: true,
        data: members,
        message: 'Members retrieved successfully'
      } as ApiResponse);
      return;
    }

    // Get specific member
    if (req.method === 'GET' && memberId && !action) {
      const member = await supabaseService.getMemberById(memberId as string);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: member,
        message: 'Member retrieved successfully'
      } as ApiResponse);
      return;
    }

    // Generate ID Card
    if (req.method === 'GET' && memberId && action === 'id-card') {
      const member = await supabaseService.getMemberById(memberId as string);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        } as ApiResponse);
        return;
      }

      if (member.id_card_generated) {
        res.status(400).json({
          success: false,
          error: 'ID card has already been generated for this member'
        } as ApiResponse);
        return;
      }

      const emailService = new EmailService();
      const pdfBuffer = await emailService.generateIdCardPDF(member);

      // Update member to mark ID card as generated
      // Since updateMemberField might not exist, we'll use a direct update
      await supabaseService.updateMember(member.id, { id_card_generated: true });

      // Log activity
      await supabaseService.logActivity(
        member.email,
        'ID_CARD_GENERATED',
        'member',
        member.id,
        { member_id: member.member_id }
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="ADYC_ID_Card_${member.member_id}.pdf"`);
      res.status(200).send(pdfBuffer);
      return;
    }

    // Generate QR Code
    if (req.method === 'GET' && memberId && action === 'qr-code') {
      const member = await supabaseService.getMemberById(memberId as string);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        } as ApiResponse);
        return;
      }

      const qrService = new QRCodeService();
      const qrData = await qrService.generateMemberQR(member.member_id, member.full_name);

      res.status(200).json({
        success: true,
        data: qrData,
        message: 'QR code generated successfully'
      } as ApiResponse);
      return;
    }

    // Default response for unknown actions
    res.status(404).json({
      success: false,
      error: 'Member action not found'
    } as ApiResponse);

  } catch (error) {
    console.error('Members API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}