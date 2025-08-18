# Environment Variables

This document lists all required and optional environment variables for the reachoutto.me application.

## Required Variables

These environment variables **must** be set in your Vercel project dashboard:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get these values:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

## Optional Variables

### Cron Job Security (Recommended)
```
CRON_SECRET=your_random_secret_string
```
- Used to authenticate cron job requests
- Generate a random string (e.g., `openssl rand -base64 32`)
- If not set, cron endpoints are publicly accessible

### Site Configuration (Future Use)
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
- Used for OG image generation (when re-enabled)
- Defaults to `http://localhost:3000` in development

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the appropriate scope:
   - **Production**: Required for live site
   - **Preview**: Optional for preview deployments
   - **Development**: Optional for local development

## Local Development

Create a `.env.local` file in your project root:

```bash
# .env.local (DO NOT commit to git)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CRON_SECRET=your_random_secret_string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Important Notes

- ⚠️ **Never commit `.env.local` to git**
- ✅ Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- ✅ Other variables are server-side only
- ✅ All pages with Supabase integration use `dynamic = 'force-dynamic'` to prevent build-time errors

## Troubleshooting

### Build Errors
If you see errors like "Your project's URL and API key are required":
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check that the values are correct (no extra spaces, quotes, etc.)
- Verify the environment variables are set in the correct Vercel environment

### Cron Jobs Not Working
- Set the `CRON_SECRET` environment variable
- Ensure the cron job URLs are accessible
- Check Vercel Function logs for errors
