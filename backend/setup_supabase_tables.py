#!/usr/bin/env python3
"""
Setup script to create Supabase tables
Note: This requires direct database access or service role key
For now, these SQL commands should be executed in the Supabase dashboard
"""

# SQL commands to create tables in Supabase:

CREATE_TABLES_SQL = """
-- Status checks table
CREATE TABLE IF NOT EXISTS status_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Members table with enhanced security features
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passport TEXT NOT NULL,
    full_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    ward TEXT NOT NULL,
    lga TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'Nigeria',
    address TEXT NOT NULL,
    language TEXT DEFAULT '',
    marital_status TEXT DEFAULT '',
    gender TEXT NOT NULL,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    id_card_generated BOOLEAN DEFAULT FALSE,
    id_card_serial_number TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table for admin system
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    author TEXT NOT NULL,
    author_email TEXT NOT NULL,
    image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs for monitoring
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_member_id ON members(member_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_email ON activity_logs(user_email);
"""

if __name__ == "__main__":
    print("=== SUPABASE TABLE SETUP ===")
    print("\nPlease execute the following SQL commands in your Supabase dashboard:")
    print("1. Go to https://pgjqjwvdymvpzxxfhkxa.supabase.co")
    print("2. Navigate to SQL Editor")
    print("3. Execute the following SQL:\n")
    print(CREATE_TABLES_SQL)
    print("\n=== END OF SQL COMMANDS ===")