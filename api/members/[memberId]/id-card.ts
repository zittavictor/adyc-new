import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../../lib/supabase';
import EmailService from '../../../lib/email';
import { ApiResponse } from '../../../types';

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

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    } as ApiResponse);
  }

  try {
    const { memberId } = req.query;

    if (!memberId || typeof memberId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required'
      } as ApiResponse);
    }

    const supabaseService = new SupabaseService();
    const member = await supabaseService.getMemberById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      } as ApiResponse);
    }

    // Check if ID card has already been generated
    if (member.id_card_generated) {
      return res.status(400).json({
        success: false,
        error: 'ID card has already been generated for this member. Each member can only generate their ID card once for security purposes.'
      } as ApiResponse);
    }

    // Generate PDF
    const emailService = new EmailService();
    const pdfData = await emailService.generateIdCardPDF(member);

    // Mark ID card as generated to prevent future generations
    await supabaseService.markIdCardGenerated(memberId);

    // Log the activity
    await supabaseService.logActivity(
      member.email,
      'ID_CARD_GENERATED',
      'id_card',
      memberId,
      { serial_number: member.id_card_serial_number }
    );

    // Return PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ADYC_ID_Card_${memberId}.pdf`);
    res.status(200).send(pdfData);

  } catch (error) {
    console.error('ID card generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate ID card',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}