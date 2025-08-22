import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../lib/supabase';
import AuthService from '../../lib/auth';
import { ApiResponse } from '../../types';
import { z } from 'zod';

const adminSetupSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  setup_key: z.string().min(1)
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
    const validation = adminSetupSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors
      } as ApiResponse);
    }

    const { username, email, password, setup_key } = validation.data;

    // Simple setup key check (you can make this more secure)
    if (setup_key !== 'adyc-setup-2025-secure') {
      return res.status(403).json({
        success: false,
        error: 'Invalid setup key'
      } as ApiResponse);
    }

    const supabaseService = new SupabaseService();
    const authService = new AuthService();

    // Check if admin already exists
    const existingAdmin = await supabaseService.getAdminUser(username);
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin user already exists'
      } as ApiResponse);
    }

    // Create admin user
    const passwordHash = await authService.hashPassword(password);
    const adminData = {
      username,
      email,
      password_hash: passwordHash,
      is_active: true
    };

    await supabaseService.createAdminUser(adminData);

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: { username }
    } as ApiResponse);

  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create admin user',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}