export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_PROJECT_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_PUBLIC_KEY || '',
    projectName: process.env.VERCEL_PROJECT_NAME || 'MedSpa Growth Engine',
    productionDomain: process.env.PRODUCTION_DOMAIN || ''
  });
}
