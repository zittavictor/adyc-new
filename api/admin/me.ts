import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../lib/supabase';
import AuthService from '../../lib/auth';
import { AdminUser, ApiResponse } from '../../types';

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
    const authService = new AuthService();

    const adminUser = await authService.authenticateRequest(req, supabaseService);

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    // Remove password hash from response
    const { password_hash, ...safeAdminUser } = adminUser;

    res.status(200).json({
      success: true,
      data: safeAdminUser
    } as ApiResponse<Omit<AdminUser, 'password_hash'>>);

  } catch (error) {
    console.error('Get admin user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get admin user',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}