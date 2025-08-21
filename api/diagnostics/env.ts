import { VercelRequest, VercelResponse } from '@vercel/node';

// List the environment variables the app expects in Vercel Dashboard
const REQUIRED_ENVS = {
  supabase: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ],
  database: [
    // Optional: used only if direct Postgres connection is needed
    'DATABASE_URL'
  ],
  email: [
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USERNAME',
    'EMAIL_PASSWORD',
    'EMAIL_USE_TLS'
  ],
  cloudinary: [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ],
  sanity: [
    'SANITY_PROJECT_ID',
    'SANITY_DATASET',
    'SANITY_API_TOKEN'
  ],
  auth: [
    'JWT_SECRET_KEY'
  ]
};

function buildReport() {
  const report: any = { success: true, timestamp: new Date().toISOString() };

  for (const [section, keys] of Object.entries(REQUIRED_ENVS)) {
    report[section] = keys.reduce((acc: Record<string, boolean>, key: string) => {
      acc[key] = !!process.env[key];
      return acc;
    }, {});
  }

  // Overall status: true only if all required keys (excluding optional DATABASE_URL) are present
  const allPresent = [
    ...REQUIRED_ENVS.supabase,
    ...REQUIRED_ENVS.email,
    ...REQUIRED_ENVS.cloudinary,
    ...REQUIRED_ENVS.sanity,
    ...REQUIRED_ENVS.auth
  ].every((k) => !!process.env[k]);

  report.overall_ready = allPresent;
  report.notes = [
    'Values are not returned for security. Only presence is reported as true/false.',
    'DATABASE_URL is optional unless you directly connect to Postgres in any function.'
  ];

  return report;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic CORS for browser access to this diagnostic
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const report = buildReport();
    return res.status(200).json(report);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Internal error' });
  }
}