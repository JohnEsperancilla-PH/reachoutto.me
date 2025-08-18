# reachoutto.me

A modern, free, and open-source Linktree alternative built with Next.js, TailwindCSS, and Supabase.

![reachoutto.me](https://via.placeholder.com/800x400/1f2937/ffffff?text=reachoutto.me)

## ✨ Features

- 🔐 **Authentication** - Email/password authentication with Supabase Auth
- 👤 **User Profiles** - Customizable profiles with bio and avatar
- 🔗 **Link Management** - Add, edit, delete, and reorder links with drag-and-drop
- 🎨 **Modern UI** - Clean, minimal design with light/dark mode
- 📱 **Mobile First** - Responsive design that works on all devices
- ⚡ **Fast Performance** - Built with Next.js for optimal speed
- 🛡️ **Admin Dashboard** - Admin interface for user and content management
- 🌐 **SEO Optimized** - Meta tags and Open Graph support
- 🚀 **Easy Deployment** - Deploy to Vercel with one click

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Supabase (Auth, Database, Storage)
- **UI Components**: Custom components with Radix UI primitives
- **Deployment**: Vercel + Supabase
- **Database**: PostgreSQL (via Supabase)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/reachoutto.me.git
cd reachoutto.me
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy \`.env.local\` and add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### 4. Set Up Database

Run the SQL migration in your Supabase SQL editor:

**Option 1: Fresh Setup**
\`\`\`sql
-- Copy and paste the contents from supabase/migrations/20240101000001_initial_schema.sql
\`\`\`

**Option 2: If you get "already exists" errors**
\`\`\`sql
-- Copy and paste the contents from supabase/migrations/20240101000002_safe_schema.sql
-- This version includes safety checks for existing objects
\`\`\`

**Option 3: Add Admin Functions (Required for proper user deletion)**
\`\`\`sql
-- Copy and paste the contents from supabase/migrations/20240101000003_admin_functions.sql
-- This adds admin functions for proper user management
\`\`\`

**Option 4: Set Up Storage (Required for profile photos)**
\`\`\`sql
-- Copy and paste the contents from supabase/migrations/20240101000004_storage.sql
-- This sets up storage buckets and policies for profile photos
\`\`\`

**Option 5: Reset Everything (⚠️ This will delete all data!)**
\`\`\`sql
-- First run: supabase/migrations/cleanup.sql
-- Then run: supabase/migrations/20240101000001_initial_schema.sql
-- Then run: supabase/migrations/20240101000003_admin_functions.sql
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

\`\`\`
reachoutto.me/
├── app/                    # Next.js App Router
│   ├── [username]/        # Dynamic user profile pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── theme-toggle.tsx  # Theme switcher
├── lib/                  # Utility functions and configs
│   ├── supabase/         # Supabase client configurations
│   ├── types/            # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── supabase/             # Database migrations
└── public/               # Static assets
\`\`\`

## 🗄️ Database Schema

### Users Table
- \`id\` (UUID) - Primary key, references auth.users
- \`username\` (TEXT) - Unique username for profile URL
- \`bio\` (TEXT) - User bio/description
- \`avatar_url\` (TEXT) - Profile picture URL
- \`is_admin\` (BOOLEAN) - Admin privileges flag
- \`created_at\` (TIMESTAMP) - Account creation date

### Links Table
- \`id\` (UUID) - Primary key
- \`user_id\` (UUID) - Foreign key to users table
- \`title\` (TEXT) - Link display name
- \`url\` (TEXT) - Link URL
- \`position\` (INTEGER) - Display order
- \`created_at\` (TIMESTAMP) - Link creation date

## 🎨 Customization

### Theming
The app uses TailwindCSS with CSS variables for theming. You can customize colors in \`app/globals.css\`:

\`\`\`css
:root {
  --primary: your-primary-color;
  --secondary: your-secondary-color;
  /* ... other variables */
}
\`\`\`

### Components
All UI components are in \`components/ui/\` and can be customized to match your design system.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- Any Node.js hosting provider

## 🔧 Environment Variables

\`\`\`env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for admin features)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

## 📖 Usage

### For Users
1. Sign up with email and password
2. Set your username and bio
3. Add your important links
4. Share your profile at \`/your-username\`

### For Admins
1. Set \`is_admin = true\` in the database for admin users
2. Access admin dashboard at \`/admin\`
3. Manage users and links

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Lucide](https://lucide.dev/) - Icon library

## 📧 Support

If you have any questions or need help, please open an issue or contact [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ by [Your Name](https://github.com/yourusername)