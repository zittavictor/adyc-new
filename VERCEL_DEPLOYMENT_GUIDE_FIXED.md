# ADYC Vercel Deployment Guide - Fixed Issues

## ✅ Issues Resolved

### 1. API Route Conflict Issue Fixed
- **Problem**: The `/api/backup/` directory contained backup API files that Vercel was interpreting as actual API routes, causing conflicts
- **Solution**: Added `api/backup/` to `.vercelignore` file to exclude these backup files from deployment

### 2. Vercel Configuration Updated
- Updated `vercel.json` to include all API endpoints:
  - `api/admin/index.ts`
  - `api/members/index.ts` 
  - `api/blog/index.ts`
  - `api/utils/index.ts`

## 🚀 Deployment Steps

### Prerequisites
1. Ensure you have a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Have your environment variables ready (see below)

### Environment Variables Required
Create these in your Vercel dashboard under Project Settings > Environment Variables:

#### Supabase Configuration
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Sanity CMS Configuration
```
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=your_sanity_dataset
SANITY_API_TOKEN=your_sanity_api_token
```

#### Email Configuration (Nodemailer)
```
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=your_from_email
ADMIN_EMAIL=your_admin_email
```

#### JWT Configuration
```
JWT_SECRET=your_jwt_secret_key
JWT_ALGORITHM=HS256
```

#### Admin Setup
```
ADMIN_SETUP_KEY=your_admin_setup_key
```

### Deployment Commands

1. **Connect to Vercel** (first time only):
   ```bash
   vercel login
   vercel link
   ```

2. **Deploy to Preview** (for testing):
   ```bash
   vercel
   ```

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Verification Steps

After deployment, verify these endpoints work:

1. **Root API**: `https://your-domain.vercel.app/api/`
2. **Members**: `https://your-domain.vercel.app/api/members`
3. **Blog**: `https://your-domain.vercel.app/api/blog`
4. **Admin**: `https://your-domain.vercel.app/api/admin`

## 📁 Project Structure (Vercel-Compatible)

```
/
├── api/                    # Vercel API Functions
│   ├── index.ts           # Root API health check
│   ├── members/index.ts   # Member management
│   ├── admin/index.ts     # Admin operations
│   ├── blog/index.ts      # Blog operations
│   └── utils/index.ts     # Utility functions
├── lib/                   # Shared library code
├── types/                 # TypeScript type definitions
├── frontend/              # React application
├── package.json           # Root dependencies (API functions)
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment configuration
└── .vercelignore         # Files to exclude from deployment
```

## 🔧 Key Configuration Files

### `.vercelignore` (Updated)
```
# API backup files (not for deployment)
api/backup/

# Backend Python implementation (not used on Vercel)
backend/
**/*.py

# Other exclusions...
```

### `vercel.json` (Updated)
```json
{
  "version": 2,
  "buildCommand": "cd frontend && yarn build",
  "outputDirectory": "frontend/build",
  "installCommand": "yarn install && cd frontend && yarn install",
  "framework": "create-react-app",
  "functions": {
    "api/admin/index.ts": { "maxDuration": 30 },
    "api/members/index.ts": { "maxDuration": 30 },
    "api/blog/index.ts": { "maxDuration": 30 },
    "api/utils/index.ts": { "maxDuration": 30 }
  }
}
```

## 🚨 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Ensure all dependencies are in the root `package.json`

### Issue: Environment variables not working
**Solution**: Double-check variable names in Vercel dashboard match your code

### Issue: Database connection failures
**Solution**: Verify Supabase credentials and ensure service role key is used for API functions

### Issue: CORS errors
**Solution**: API functions include proper CORS headers - already configured

## 🎯 Next Steps After Deployment

1. Test all API endpoints
2. Verify member registration flow
3. Test admin login and blog management
4. Check ID card generation functionality
5. Verify email notifications are working

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs: `vercel logs`
2. Review function logs in Vercel dashboard
3. Test API endpoints individually
4. Verify all environment variables are set correctly