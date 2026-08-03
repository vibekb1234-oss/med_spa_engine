let supabaseClient = null;
const statusBox = () => document.getElementById('auth-status');
const setStatus = (message, type = 'info') => {
  const el = statusBox();
  if (!el) return;
  el.textContent = message;
  el.className = `status show ${type === 'error' ? 'error' : ''}`;
};
const setLoading = (on) => document.querySelectorAll('button[data-auth-action]').forEach(btn => btn.disabled = !!on);
function nextUrl() {
  const params = new URLSearchParams(location.search);
  return params.get('next') || '/dashboard';
}
async function loadEnv() {
  const res = await fetch('/api/public-env', { cache: 'no-store' });
  if (!res.ok) throw new Error('Public environment endpoint is unavailable.');
  return res.json();
}
async function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase) throw new Error('Supabase client library did not load.');
  const env = await loadEnv();
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Supabase is not configured yet. Add SUPABASE_PROJECT_URL and SUPABASE_ANON_PUBLIC_KEY in Vercel.');
  }
  supabaseClient = window.supabase.createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' }
  });
  return supabaseClient;
}
function wireTheme() {
  const saved = localStorage.getItem('mge_theme') || localStorage.getItem('mge_public_theme') || 'dark';
  document.documentElement.dataset.theme = saved;
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = saved === 'dark' ? '☾' : '☀';
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('mge_theme', next);
    localStorage.setItem('mge_public_theme', next);
    btn.textContent = next === 'dark' ? '☾' : '☀';
  });
}
async function signInPassword(ev) {
  ev.preventDefault();
  setLoading(true);
  try {
    const client = await getSupabase();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    location.href = nextUrl();
  } catch (error) { setStatus(error.message, 'error'); } finally { setLoading(false); }
}
async function signUpPassword(ev) {
  ev.preventDefault();
  setLoading(true);
  try {
    const client = await getSupabase();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value.trim();
    const company = document.getElementById('company').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const { error } = await client.auth.signUp({ email, password, options: { data: { name, company_name: company, phone } } });
    if (error) throw error;
    setStatus('Account created. Check your inbox if email confirmation is enabled, then sign in.');
  } catch (error) { setStatus(error.message, 'error'); } finally { setLoading(false); }
}
async function sendMagicLink() {
  setLoading(true);
  try {
    const client = await getSupabase();
    const email = document.getElementById('email').value.trim();
    if (!email) throw new Error('Enter your email first.');
    const redirectTo = `${location.origin}/auth/callback?next=${encodeURIComponent(nextUrl())}`;
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    if (error) throw error;
    setStatus('Magic link sent. Check your inbox.');
  } catch (error) { setStatus(error.message, 'error'); } finally { setLoading(false); }
}
async function signInGoogle() {
  setLoading(true);
  try {
    const client = await getSupabase();
    const redirectTo = `${location.origin}/auth/callback?next=${encodeURIComponent(nextUrl())}`;
    const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) throw error;
  } catch (error) { setStatus(error.message, 'error'); setLoading(false); }
}
async function sendReset(ev) {
  ev.preventDefault();
  setLoading(true);
  try {
    const client = await getSupabase();
    const email = document.getElementById('email').value.trim();
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/dashboard` });
    if (error) throw error;
    setStatus('Reset link sent. Check your inbox.');
  } catch (error) { setStatus(error.message, 'error'); } finally { setLoading(false); }
}
async function handleCallback() {
  try {
    const client = await getSupabase();
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    if (!data.session) throw new Error('No active session found. Try signing in again.');
    location.replace(nextUrl());
  } catch (error) { setStatus(error.message, 'error'); }
}
document.addEventListener('DOMContentLoaded', wireTheme);
window.MGEAuth = { signInPassword, signUpPassword, sendMagicLink, signInGoogle, sendReset, handleCallback };
