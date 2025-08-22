import { VercelRequest, VercelResponse } from '@vercel/node';
import SupabaseService from '../../lib/supabase';
import AuthService from '../../lib/auth';
import SanityService from '../../lib/sanity';
import { AdminLogin, Token, ApiResponse, BlogPostCreate, BlogPostUpdate } from '../../types';
import { z } from 'zod';

const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const blogPostCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  youtube_url: z.string().optional(),
  published: z.boolean().optional().default(false)
});

const blogPostUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  summary: z.string().optional(),
  youtube_url: z.string().optional(),
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

  const { action, postId } = req.query;
  
  try {
    const supabaseService = new SupabaseService();
    const authService = new AuthService();
    const sanityService = new SanityService();

    // Admin Login
    if (action === 'login' && req.method === 'POST') {
      const validation = adminLoginSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        } as ApiResponse);
        return;
      }

      const { username, password } = validation.data;
      const adminUser = await supabaseService.getAdminUser(username);
      
      if (!adminUser || !await authService.verifyPassword(password, adminUser.password_hash)) {
        res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        } as ApiResponse);
        return;
      }

      const tokenData = authService.createAccessToken({ username: adminUser.username });

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
      return;
    }

    // Authenticate for all other admin operations
    const adminUser = await authService.authenticateRequest(req, supabaseService);
    
    if (!adminUser) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    // Admin Profile
    if (action === 'me' && req.method === 'GET') {
      res.status(200).json({
        success: true,
        data: {
          username: adminUser.username,
          email: adminUser.email,
          is_active: adminUser.is_active,
          created_at: adminUser.created_at
        },
        message: 'Admin profile retrieved successfully'
      } as ApiResponse);
      return;
    }

    // Dashboard Stats
    if (action === 'dashboard' && req.method === 'GET') {
      const stats = await supabaseService.getDashboardStats();
      
      res.status(200).json({
        success: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully'
      } as ApiResponse);
      return;
    }

    // Activity Logs
    if (action === 'activity' && req.method === 'GET') {
      const limit = parseInt(req.query.limit as string) || 50;
      const activities = await supabaseService.getActivityLogs(limit);
      
      res.status(200).json({
        success: true,
        data: activities,
        message: 'Activity logs retrieved successfully'
      } as ApiResponse);
      return;
    }

    // Blog Posts Management
    if (action === 'blog') {
      if (req.method === 'GET') {
        const posts = await sanityService.getBlogPosts(false); // Include drafts for admin
        res.status(200).json({
          success: true,
          data: posts,
          message: 'Blog posts retrieved successfully'
        } as ApiResponse);
        return;
      }

      if (req.method === 'POST') {
        const validation = blogPostCreateSchema.safeParse(req.body);
        
        if (!validation.success) {
          res.status(400).json({
            success: false,
            error: 'Invalid input',
            details: validation.error.errors
          } as ApiResponse);
          return;
        }

        const postData = {
          ...validation.data,
          author: adminUser.username,
          authorEmail: adminUser.email
        } as BlogPostCreate;

        const createdPost = await sanityService.createBlogPost(postData);

        await supabaseService.logActivity(
          adminUser.email,
          'BLOG_POST_CREATED',
          'admin',
          adminUser.id,
          { post_id: createdPost.id, title: createdPost.title }
        );

        res.status(201).json({
          success: true,
          data: createdPost,
          message: 'Blog post created successfully'
        } as ApiResponse);
        return;
      }
    }

    // Individual Blog Post Management
    if (action === 'blog-post' && postId && req.method === 'PUT') {
      const validation = blogPostUpdateSchema.safeParse(req.body);
      
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validation.error.errors
        } as ApiResponse);
        return;
      }

      const updatedPost = await sanityService.updateBlogPost(postId as string, validation.data);

      if (!updatedPost) {
        res.status(404).json({
          success: false,
          error: 'Blog post not found'
        } as ApiResponse);
        return;
      }

      await supabaseService.logActivity(
        adminUser.email,
        'BLOG_POST_UPDATED',
        'admin',
        adminUser.id,
        { post_id: updatedPost.id, title: updatedPost.title }
      );

      res.status(200).json({
        success: true,
        data: updatedPost,
        message: 'Blog post updated successfully'
      } as ApiResponse);
      return;
    }

    if (action === 'blog-post' && postId && req.method === 'DELETE') {
      const deleted = await sanityService.deleteBlogPost(postId as string);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Blog post not found'
        } as ApiResponse);
        return;
      }

      await supabaseService.logActivity(
        adminUser.email,
        'BLOG_POST_DELETED',
        'admin',
        adminUser.id,
        { post_id: postId }
      );

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      } as ApiResponse);
      return;
    }

    // Default response for unknown actions
    res.status(404).json({
      success: false,
      error: 'Admin action not found'
    } as ApiResponse);

  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}