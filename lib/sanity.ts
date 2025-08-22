import { BlogPost, BlogPostCreate, BlogPostUpdate } from '../types';

class SanityService {
  private projectId: string;
  private dataset: string;
  private token: string;
  private baseUrl: string;
  private queryUrl: string;

  constructor() {
    this.projectId = process.env.SANITY_PROJECT_ID!;
    this.dataset = process.env.SANITY_DATASET!;
    this.token = process.env.SANITY_API_TOKEN!;

    if (!this.projectId || !this.dataset || !this.token) {
      throw new Error('Missing Sanity configuration');
    }

    this.baseUrl = `https://${this.projectId}.api.sanity.io/v2021-06-07/data/mutate/${this.dataset}`;
    this.queryUrl = `https://${this.projectId}.api.sanity.io/v2021-06-07/data/query/${this.dataset}`;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async createBlogPost(postData: BlogPostCreate & { author: string; author_email: string }): Promise<BlogPost> {
    try {
      const docId = crypto.randomUUID();
      const now = new Date().toISOString();

      const sanityDoc = {
        _type: 'blogPost',
        _id: docId,
        title: postData.title,
        content: postData.content,
        summary: postData.summary,
        author: postData.author,
        authorEmail: postData.author_email,
        youtubeUrl: postData.youtube_url,
        published: postData.published || false,
        publishedAt: postData.published ? now : null,
        createdAt: now,
        updatedAt: now,
        slug: {
          _type: 'slug',
          current: this.generateSlug(postData.title)
        }
      };

      const mutation = {
        mutations: [{ create: sanityDoc }]
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(mutation)
      });

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.statusText}`);
      }

      const result: any = await response.json();
      
      if (result.results && result.results.length > 0) {
        const createdDoc = result.results[0].document || result.results[0];
        return this.formatBlogPost(createdDoc);
      }

      throw new Error('No document returned from Sanity');
    } catch (error) {
      throw new Error(`Failed to create blog post: ${error}`);
    }
  }

  async getBlogPosts(publishedOnly: boolean = true): Promise<BlogPost[]> {
    try {
      const filterClause = publishedOnly ? 'published == true' : 'true';
      const query = `
        *[_type == "blogPost" && ${filterClause}] | order(publishedAt desc, createdAt desc) {
          _id,
          title,
          content,
          summary,
          author,
          authorEmail,
          youtubeUrl,
          published,
          publishedAt,
          createdAt,
          updatedAt,
          slug
        }
      `;

      const response = await fetch(`${this.queryUrl}?query=${encodeURIComponent(query)}`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.statusText}`);
      }

      const result: any = await response.json();
      const posts = result.result || [];
      
      return posts.map((post: any) => this.formatBlogPost(post));
    } catch (error) {
      throw new Error(`Failed to fetch blog posts: ${error}`);
    }
  }

  async getBlogPostById(postId: string): Promise<BlogPost | null> {
    try {
      const query = `*[_type == "blogPost" && _id == "${postId}"][0]`;

      const response = await fetch(`${this.queryUrl}?query=${encodeURIComponent(query)}`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.statusText}`);
      }

      const result = await response.json();
      const post = result.result;

      return post ? this.formatBlogPost(post) : null;
    } catch (error) {
      throw new Error(`Failed to fetch blog post: ${error}`);
    }
  }

  async updateBlogPost(postId: string, updateData: BlogPostUpdate): Promise<BlogPost | null> {
    try {
      const patchData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      if (updateData.published === true) {
        patchData.publishedAt = new Date().toISOString();
      }

      const mutation = {
        mutations: [{
          patch: {
            id: postId,
            set: patchData
          }
        }]
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(mutation)
      });

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.results && result.results.length > 0) {
        const updatedDoc = result.results[0].document || result.results[0];
        return this.formatBlogPost(updatedDoc);
      }

      return null;
    } catch (error) {
      throw new Error(`Failed to update blog post: ${error}`);
    }
  }

  async deleteBlogPost(postId: string): Promise<boolean> {
    try {
      const mutation = {
        mutations: [{
          delete: {
            id: postId
          }
        }]
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(mutation)
      });

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.results && result.results.length > 0;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }

  private formatBlogPost(sanityDoc: any): BlogPost {
    if (!sanityDoc) {
      return {
        id: crypto.randomUUID(),
        title: 'Unknown Title',
        content: 'Unknown Content',
        author: 'Unknown Author',
        author_email: 'unknown@adyc.org',
        published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    return {
      id: sanityDoc._id || crypto.randomUUID(),
      title: sanityDoc.title || 'Unknown Title',
      content: sanityDoc.content || 'Unknown Content',
      summary: sanityDoc.summary,
      author: sanityDoc.author || 'Unknown Author',
      author_email: sanityDoc.authorEmail || 'unknown@adyc.org',
      youtube_url: sanityDoc.youtubeUrl,
      published: sanityDoc.published || false,
      created_at: sanityDoc.createdAt || new Date().toISOString(),
      updated_at: sanityDoc.updatedAt || new Date().toISOString()
    };
  }

  private generateSlug(title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-')
      .trim();
    
    const timestamp = Date.now().toString().slice(-6);
    return slug ? `${slug}-${timestamp}` : `post-${timestamp}`;
  }
}

export default SanityService;