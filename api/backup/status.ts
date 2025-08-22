import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../lib/supabase';
import { StatusCheck, StatusCheckCreate, ApiResponse } from '../types';
import { z } from 'zod';

const statusCheckCreateSchema = z.object({
  client_name: z.string().min(1)
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

  try {
    const supabaseService = new SupabaseService();

    if (req.method === 'POST') {
      const validation = statusCheckCreateSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        } as ApiResponse);
      }

      const result = await supabaseService.createStatusCheck(validation.data.client_name);
      
      res.status(201).json({
        success: true,
        data: result
      } as ApiResponse<StatusCheck>);
      
    } else if (req.method === 'GET') {
      const statusChecks = await supabaseService.getStatusChecks();
      
      res.status(200).json({
        success: true,
        data: statusChecks
      } as ApiResponse<StatusCheck[]>);
      
    } else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      } as ApiResponse);
    }
  } catch (error) {
    console.error('Status endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}