import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MemberRegistration, BlogPost, AdminUser, ActivityLog, DashboardStats } from '../types';

class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // STATUS CHECKS
  async createStatusCheck(clientName: string) {
    const data = {
      id: crypto.randomUUID(),
      client_name: clientName,
      timestamp: new Date().toISOString()
    };

    const { data: result, error } = await this.supabase
      .from('status_checks')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Error creating status check: ${error.message}`);
    return result;
  }

  async getStatusChecks() {
    const { data, error } = await this.supabase
      .from('status_checks')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1000);

    if (error) throw new Error(`Error fetching status checks: ${error.message}`);
    return data || [];
  }

  // MEMBERS
  async createMember(memberData: Partial<MemberRegistration>) {
    // Check if email already exists
    const { data: existing } = await this.supabase
      .from('members')
      .select('id')
      .eq('email', memberData.email)
      .single();

    if (existing) {
      throw new Error('Email already registered');
    }

    // Generate unique member ID and serial number
    const currentYear = new Date().getFullYear();
    const randomId = crypto.randomUUID().slice(0, 6).toUpperCase();
    const memberId = `ADYC-${currentYear}-${randomId}`;
    const serialNumber = `SN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const data = {
      id: crypto.randomUUID(),
      member_id: memberId,
      id_card_serial_number: serialNumber,
      registration_date: new Date().toISOString(),
      ...memberData
    };

    const { data: result, error } = await this.supabase
      .from('members')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Error creating member: ${error.message}`);

    // Log activity
    await this.logActivity(
      memberData.email,
      'MEMBER_REGISTRATION',
      'member',
      memberId,
      { full_name: memberData.full_name }
    );

    return result;
  }

  async getMembers() {
    const { data, error } = await this.supabase
      .from('members')
      .select('*')
      .order('registration_date', { ascending: false })
      .limit(1000);

    if (error) throw new Error(`Error fetching members: ${error.message}`);
    return data || [];
  }

  async getMemberById(memberId: string) {
    const { data, error } = await this.supabase
      .from('members')
      .select('*')
      .eq('member_id', memberId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching member: ${error.message}`);
    }
    
    return data || null;
  }

  async markIdCardGenerated(memberId: string) {
    const { data, error } = await this.supabase
      .from('members')
      .update({
        id_card_generated: true,
        updated_at: new Date().toISOString()
      })
      .eq('member_id', memberId)
      .select();

    if (error) throw new Error(`Error marking ID card as generated: ${error.message}`);
    return !!data?.length;
  }

  async updateMemberPhoto(memberId: string, photoUrl: string, photoPublicId: string) {
    const { data, error } = await this.supabase
      .from('members')
      .update({
        passport: photoUrl,
        photo_public_id: photoPublicId,
        updated_at: new Date().toISOString()
      })
      .eq('member_id', memberId)
      .select();

    if (error) throw new Error(`Error updating member photo: ${error.message}`);
    return !!data?.length;
  }

  // ADMIN USERS
  async createAdminUser(adminData: Partial<AdminUser>) {
    const data = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...adminData
    };

    const { data: result, error } = await this.supabase
      .from('admin_users')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Error creating admin user: ${error.message}`);
    return result;
  }

  async getAdminUser(username: string) {
    const { data, error } = await this.supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching admin user: ${error.message}`);
    }
    
    return data || null;
  }

  // BLOG POSTS
  async createBlogPost(postData: Partial<BlogPost>) {
    const data = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...postData
    };

    const { data: result, error } = await this.supabase
      .from('blog_posts')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Error creating blog post: ${error.message}`);

    // Log activity
    await this.logActivity(
      postData.author_email,
      'BLOG_POST_CREATED',
      'blog_post',
      data.id,
      { title: postData.title }
    );

    return result;
  }

  async getBlogPosts(publishedOnly: boolean = true) {
    let query = this.supabase
      .from('blog_posts')
      .select('*');

    if (publishedOnly) {
      query = query.eq('published', true);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching blog posts: ${error.message}`);
    return data || [];
  }

  async updateBlogPost(postId: string, updateData: Partial<BlogPost>) {
    const data = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    const { data: result, error } = await this.supabase
      .from('blog_posts')
      .update(data)
      .eq('id', postId)
      .select()
      .single();

    if (error) throw new Error(`Error updating blog post: ${error.message}`);
    return result;
  }

  async deleteBlogPost(postId: string) {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)
      .select();

    if (error) throw new Error(`Error deleting blog post: ${error.message}`);
    return !!data?.length;
  }

  // DASHBOARD & ANALYTICS
  async getDashboardStats(): Promise<DashboardStats> {
    const [membersResult, blogPostsResult, publishedPostsResult, recentActivityResult] = 
      await Promise.all([
        this.supabase.from('members').select('id'),
        this.supabase.from('blog_posts').select('id'),
        this.supabase.from('blog_posts').select('id').eq('published', true),
        this.supabase
          .from('activity_logs')
          .select('id')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

    return {
      total_members: membersResult.data?.length || 0,
      total_blog_posts: blogPostsResult.data?.length || 0,
      published_blog_posts: publishedPostsResult.data?.length || 0,
      recent_activity_count: recentActivityResult.data?.length || 0
    };
  }

  // ACTIVITY LOGGING
  async logActivity(
    userEmail?: string,
    action: string = '',
    resourceType: string = '',
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ) {
    try {
      const data = {
        id: crypto.randomUUID(),
        user_email: userEmail,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      };

      await this.supabase
        .from('activity_logs')
        .insert(data);
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw here as this shouldn't break the main operation
    }
  }

  async getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Error fetching activity logs: ${error.message}`);
    return data || [];
  }
}

export default SupabaseService;