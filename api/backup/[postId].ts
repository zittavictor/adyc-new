import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../../../lib/supabase';
import SanityService from '../../../../lib/sanity';
import AuthService from '../../../../lib/auth';
import { BlogPost, BlogPostUpdate, ApiResponse } from '../../../../types';
import { z } from 'zod';

const blogPostUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  summary: z.string().optional(),
  youtube_url: z.string().url().optional(),
  published: z.boolean().optional()
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
    const { postId } = req.query;

    if (!postId || typeof postId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required'
      } as ApiResponse);
    }

    const supabaseService = new SupabaseService();
    const authService = new AuthService();

    // Authenticate admin user
    const adminUser = await authService.authenticateRequest(req, supabaseService);

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    const sanityService = new SanityService();

    if (req.method === 'PUT') {
      // Update blog post
      const validation = blogPostUpdateSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        } as ApiResponse);
      }

      const result = await sanityService.updateBlogPost(postId, validation.data);

      if (!result) {
        return res.status(404).json({
          success: false,
          error: 'Blog post not found'
        } as ApiResponse);
      }

      res.status(200).json({
        success: true,
        data: result,
        message: 'Blog post updated successfully'
      } as ApiResponse<BlogPost>);

    } else if (req.method === 'DELETE') {
      // Delete blog post
      const success = await sanityService.deleteBlogPost(postId);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Blog post not found'
        } as ApiResponse);
      }

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      } as ApiResponse);

    } else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      } as ApiResponse);
    }

  } catch (error) {
    console.error('Admin blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process blog post request',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}