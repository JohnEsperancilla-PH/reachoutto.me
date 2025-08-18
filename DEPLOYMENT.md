# Deployment Guide

This guide will walk you through deploying reachoutto.me to Vercel and Supabase.

## Prerequisites

- A GitHub account
- A Vercel account
- A Supabase account

## Step 1: Set Up Supabase

### 1.1 Create a New Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: reachoutto-me (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Configure Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of \`supabase/migrations/20240101000001_initial_schema.sql\`
3. Paste and run the SQL to create tables and policies

### 1.3 Get API Keys

1. Go to Settings > API
2. Copy the following values:
   - **Project URL**: \`https://your-project-id.supabase.co\`
   - **anon public key**: \`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\`
   - **service_role key**: \`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\` (for admin features)

### 1.4 Configure Authentication

1. Go to Authentication > Settings
2. Configure Site URL:
   - For development: \`http://localhost:3000\`
   - For production: \`https://your-domain.com\`
3. Add Redirect URLs:
   - \`http://localhost:3000/**\` (development)
   - \`https://your-domain.com/**\` (production)

## Step 2: Deploy to Vercel

### 2.1 Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

\`\`\`bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/reachoutto-me.git
git push -u origin main
\`\`\`

### 2.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: \`./\`
   - **Build Command**: \`npm run build\`
   - **Output Directory**: \`.next\`

### 2.3 Add Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

### 2.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at \`https://your-project-name.vercel.app\`

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Domain in Vercel

1. Go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 3.2 Update Supabase URLs

1. Go to Supabase Authentication settings
2. Update Site URL and Redirect URLs to use your custom domain

## Step 4: Set Up Admin User

### 4.1 Create First User

1. Go to your deployed app
2. Sign up with your admin email
3. Verify your email

### 4.2 Grant Admin Access

1. Go to Supabase Dashboard > Table Editor
2. Find your user in the \`users\` table
3. Set \`is_admin\` to \`true\`
4. Now you can access \`/admin\` on your site

## Step 5: Testing

### 5.1 Test Authentication

- Sign up with a new account
- Verify email confirmation works
- Test login/logout

### 5.2 Test Core Features

- Update profile (username, bio)
- Add/edit/delete links
- Test drag-and-drop reordering
- Visit public profile page

### 5.3 Test Admin Features

- Access admin dashboard
- View users and links
- Test admin actions (delete users/links)

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Supabase Site URL and Redirect URLs
   - Verify environment variables are set correctly

2. **Database errors**
   - Ensure SQL migration was run successfully
   - Check RLS policies are enabled

3. **Build failures**
   - Check all environment variables are set
   - Verify Node.js version compatibility

4. **Theme not persisting**
   - Check localStorage is working
   - Verify theme toggle component is client-side

### Environment-Specific Issues

#### Development
- Use \`http://localhost:3000\` in Supabase settings
- Check \`.env.local\` file exists and has correct values

#### Production
- Use your production domain in Supabase settings
- Verify environment variables in Vercel dashboard
- Check build logs for any errors

## Security Considerations

1. **Row Level Security**: Ensure RLS is enabled on all tables
2. **API Keys**: Never expose service role key in client-side code
3. **User Input**: Validate and sanitize all user inputs
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure proper CORS settings in Supabase

## Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in your project settings
2. Monitor page views and performance metrics

### Supabase Monitoring

1. Monitor database usage in Supabase dashboard
2. Set up alerts for high usage or errors
3. Review authentication logs regularly

## Backup Strategy

1. **Database**: Supabase provides automatic backups
2. **Code**: Keep code in version control (GitHub)
3. **Environment**: Document all environment variables
4. **Media**: If using file uploads, consider backup strategy

## Scaling Considerations

As your app grows, consider:

1. **Database**: Monitor connection limits and query performance
2. **CDN**: Use Vercel's global CDN for static assets
3. **Caching**: Implement appropriate caching strategies
4. **Rate Limiting**: Add rate limiting to prevent abuse

---

Need help? Check the [main README](README.md) or open an issue on GitHub.
