# Admin Europe - Exhibition Stand Builder CMS
A modern React-based Content Management System for managing exhibition stand builder website content.

## 🚀 Features

- **Home Page Management** - Edit hero sections, content blocks, and solutions
- **About Page Management** - Manage company info, team details, services, and statistics
- **Services Page Management** - Manage services page content and individual services
- **Rich Text Editor** - WYSIWYG editor for content creation
- **Image Upload** - Supabase storage integration for media management
- **Authentication** - Secure admin access with Supabase Auth
- **Responsive Design** - Mobile-first design with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Database + Auth + Storage)
- **Rich Text**: TipTap Editor
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v7

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-europe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Run the migrations in `src/migrations/` in your Supabase SQL editor
   - Or use Supabase CLI: `supabase db reset`

## 🚀 Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## 🏗 Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Clean build directory
npm run clean
```

## 📦 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Manual Deployment
1. Run `npm run build`
2. Upload `dist/` folder to your web server
3. Configure web server to serve `index.html` for all routes

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |

## 📁 Project Structure

```
src/
├── admin/           # Admin interface components
├── components/      # Reusable UI components
├── contexts/        # React contexts (Auth, etc.)
├── data/           # Data services and types
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
├── migrations/     # Database migrations
├── pages/          # Page components
└── config/         # Configuration files
```

## 🗃 Database Schema

- **home_page** - Home page content management
- **about_page** - About page content management
- **services** - Services page content management
- **Storage buckets** - Image and media storage

## 🔒 Security

- Environment variables are excluded from version control
- Supabase RLS (Row Level Security) enabled
- Authentication required for admin access
- Image upload restrictions and validation

## 🐛 Troubleshooting

### Build Issues
- Ensure all TypeScript errors are resolved
- Check that all dependencies are installed
- Verify environment variables are set

### Database Issues
- Ensure migrations are applied
- Check Supabase connection
- Verify RLS policies are configured

### Authentication Issues
- Check Supabase Auth configuration
- Verify redirect URLs in Supabase dashboard
- Ensure user has proper permissions

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For support and questions, contact the development team.
