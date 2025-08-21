// Type definitions for ADYC application

export interface StatusCheck {
  id: string;
  client_name: string;
  timestamp: string;
}

export interface StatusCheckCreate {
  client_name: string;
}

export interface MemberRegistration {
  id: string;
  member_id: string;
  email: string;
  passport: string;
  full_name: string;
  dob: string;
  ward: string;
  lga: string;
  state: string;
  country: string;
  address: string;
  language?: string;
  marital_status?: string;
  gender: string;
  registration_date: string;
  id_card_generated?: boolean;
  id_card_serial_number?: string;
  photo_public_id?: string;
}

export interface MemberRegistrationCreate {
  email: string;
  passport: string;
  full_name: string;
  dob: string;
  ward: string;
  lga: string;
  state: string;
  country?: string;
  address: string;
  language?: string;
  marital_status?: string;
  gender: string;
}

export interface AdminLogin {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  password_hash: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author: string;
  author_email: string;
  youtube_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreate {
  title: string;
  content: string;
  summary?: string;
  youtube_url?: string;
  published?: boolean;
}

export interface BlogPostUpdate {
  title?: string;
  content?: string;
  summary?: string;
  youtube_url?: string;
  published?: boolean;
}

export interface PhotoUploadResponse {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface QRCodeResponse {
  qr_code_base64: string;
  verification_url: string;
  member_id: string;
  qr_type: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  total_members: number;
  total_blog_posts: number;
  published_blog_posts: number;
  recent_activity_count: number;
}

export interface ActivityLog {
  id: string;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}