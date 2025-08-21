import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../lib/supabase';
import { MemberRegistration, ApiResponse } from '../../types';

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
    const supabaseService = new SupabaseService();
    const members = await supabaseService.getMembers();

    res.status(200).json({
      success: true,
      data: members
    } as ApiResponse<MemberRegistration[]>);

  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch members',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}