import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../lib/supabase';
import AuthService from '../../lib/auth';
import { AdminLogin, Token, ApiResponse } from '../../types';
import { z } from 'zod';

const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
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
    const validation = adminLoginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors
      } as ApiResponse);
    }

    const { username, password } = validation.data;
    const supabaseService = new SupabaseService();
    const authService = new AuthService();

    const adminUser = await supabaseService.getAdminUser(username);
    
    if (!adminUser || !await authService.verifyPassword(password, adminUser.password_hash)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      } as ApiResponse);
    }

    const tokenData = authService.createAccessToken({ username: adminUser.username });

    // Log admin login
    await supabaseService.logActivity(
      adminUser.email,
      'ADMIN_LOGIN',
      'admin',
      adminUser.id,
      { username: adminUser.username }
    );

    res.status(200).json({
      success: true,
      data: tokenData,
      message: 'Login successful'
    } as ApiResponse<Token>);

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}