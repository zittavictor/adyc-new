import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../../lib/supabase';
import QRCodeService from '../../../lib/qr';
import { QRCodeResponse, ApiResponse } from '../../../types';

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

    const qrService = new QRCodeService();
    const qrData = await qrService.generateMemberQR(memberId, member.full_name);

    res.status(200).json({
      success: true,
      data: qrData
    } as ApiResponse<QRCodeResponse>);

  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}