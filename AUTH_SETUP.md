# Authentication Setup Guide

## Overview

The admin dashboard now includes simple authentication using Supabase Auth. Only authenticated users can access admin pages.

## Features

### Authentication System
- **Login Page** - Clean, branded login interface at `/login`
- **Protected Routes** - All admin pages require authentication
- **Auto Redirect** - Redirects to login if not authenticated
- **Session Management** - Automatic session handling with Supabase
- **Logout Functionality** - Sign out from sidebar

### Security
- **Row Level Security** - Database policies enforce access control
- **Simple Auth** - Uses only Supabase auth.users table (no additional tables)
- **Protected API Calls** - All admin operations require authentication
- **Secure Session Management** - Automatic token refresh

## Setup Instructions

### 1. Run Database Migration (Optional)

Execute the SQL in `src/migrations/002_setup_auth.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `002_setup_auth.sql`
4. Click "Run" to execute the migration

This will:
- Update home_page RLS policies to require authentication for admin operations
- Allow public read access to active content

### 2. Create Admin Users

**Method 1: Through Supabase Dashboard (Recommended)**
1. Go to Authentication > Users in Supabase dashboard
2. Click "Add User"
3. Enter email and password
4. User can now login to admin dashboard

**Method 2: Through Auth API**
```javascript
// Example signup (for initial setup only)
const { data, error } = await supabase.auth.signUp({
  email: 'admin@yourcompany.com',
  password: 'secure-password'
})
```

### 3. Test the Authentication

1. Start your development server
2. Navigate to your admin URL
3. You should be redirected to `/login`
4. Enter your admin credentials
5. You should be redirected to the dashboard

## Usage

### For Admin Users

1. **Access Admin Dashboard:**
   - Navigate to your admin URL
   - You'll be redirected to `/login` if not authenticated

2. **Login:**
   - Enter your email and password
   - Click "Sign In"
   - You'll be redirected to the dashboard

3. **Logout:**
   - Click the "Sign Out" button in the sidebar
   - You'll be redirected to the login page

### For Developers

**Using Auth Context:**
```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, signOut, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>
  
  return <div>Welcome {user.email}</div>
}
```

**Protected Components:**
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

<ProtectedRoute>
  <YourAdminComponent />
</ProtectedRoute>
```

## Security Features

### Database Level
- **RLS Policies** - Enforce authentication at database level
- **Simple Auth** - Uses only Supabase auth.users (no additional tables)
- **Secure Access** - All admin operations require valid session

### Application Level
- **Route Protection** - All admin routes require authentication
- **Context Provider** - Centralized auth state management
- **Automatic Redirects** - Seamless user experience
- **Loading States** - Proper loading indicators

### API Level
- **Authenticated Requests** - All admin API calls include auth headers
- **Session Validation** - Automatic session refresh
- **Error Handling** - Proper error messages and states

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context provider
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── pages/
│   └── Login.tsx               # Login page component
├── migrations/
│   └── 002_setup_auth.sql      # Database migration for auth
└── App.tsx                     # Updated with auth routing
```

## Environment Variables

Ensure these are set in your `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Troubleshooting

### Common Issues

1. **"User not found" error:**
   - Ensure user exists in Supabase Auth
   - Verify user credentials are correct

2. **Redirect loop:**
   - Clear browser cache and cookies
   - Check Supabase URL and keys in .env
   - Verify the user session is being set correctly

3. **Database access denied:**
   - Verify RLS policies are correctly set
   - Ensure user is authenticated
   - Check Supabase session is valid

4. **Login not working:**
   - Check browser console for errors
   - Verify Supabase credentials
   - Check if user exists in auth.users table

### Debug Steps

1. **Check Auth State:**
   ```tsx
   const { user, session, loading } = useAuth()
   console.log({ user, session, loading })
   ```

2. **Check Database:**
   - Verify user exists in `auth.users`
   - Test RLS policies in SQL editor
   - Check if session is valid

3. **Check Network:**
   - Open browser dev tools
   - Check network tab for auth requests
   - Look for 401/403 errors

## Production Considerations

1. **Strong Passwords** - Enforce password policies in Supabase
2. **Email Verification** - Enable email confirmation if needed
3. **Session Timeout** - Configure appropriate session duration
4. **Rate Limiting** - Set up rate limiting for login attempts
5. **Monitoring** - Monitor failed login attempts
6. **Backup Access** - Maintain emergency admin access

## Next Steps

- Set up email templates for password reset
- Add user management interface
- Implement role-based permissions
- Add audit logging for admin actions
- Set up monitoring and alerts
- Configure email verification if needed

## Testing

To test the authentication system:

1. **Without Authentication:**
   - Try accessing `/` or `/admin/home`
   - Should redirect to `/login`

2. **With Authentication:**
   - Login with valid credentials
   - Should access admin pages normally
   - Logout should redirect to login

3. **Session Persistence:**
   - Login and refresh the page
   - Should remain logged in
   - Close and reopen browser tab
   - Should remain logged in (until session expires)

The authentication system is now fully integrated and ready for production use!