import { VercelRequest, VercelResponse } from '@vercel/node';
import SanityService from '../../lib/sanity';
import { BlogPost, ApiResponse } from '../../types';

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
    const { published_only } = req.query;
    const publishedOnly = published_only !== 'false'; // Default to true, only false if explicitly set

    const sanityService = new SanityService();
    const posts = await sanityService.getBlogPosts(publishedOnly);

    res.status(200).json({
      success: true,
      data: posts
    } as ApiResponse<BlogPost[]>);

  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
}