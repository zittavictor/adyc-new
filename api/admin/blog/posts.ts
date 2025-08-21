import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../../lib/supabase';
import SanityService from '../../../lib/sanity';
import AuthService from '../../../lib/auth';
import { BlogPost, BlogPostCreate, ApiResponse } from '../../../types';
import { z } from 'zod';

const blogPostCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  youtube_url: z.string().url().optional(),
  published: z.boolean().optional().default(false)
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
    const authService = new AuthService();

    // Authenticate admin user
    const adminUser = await authService.authenticateRequest(req, supabaseService);

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    if (req.method === 'POST') {
      // Create blog post
      const validation = blogPostCreateSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        } as ApiResponse);
      }

      const postData = {
        ...validation.data,
        author: adminUser.username,
        author_email: adminUser.email
      };

      const sanityService = new SanityService();
      const result = await sanityService.createBlogPost(postData);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Blog post created successfully'
      } as ApiResponse<BlogPost>);

    } else if (req.method === 'GET') {
      // Get all blog posts (including drafts)
      const sanityService = new SanityService();
      const posts = await sanityService.getBlogPosts(false); // Include unpublished

      res.status(200).json({
        success: true,
        data: posts
      } as ApiResponse<BlogPost[]>);

    } else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      } as ApiResponse);
    }

  } catch (error) {
    console.error('Admin blog posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process blog post request',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}