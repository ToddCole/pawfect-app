# Troubleshooting Authentication Issues

This guide helps you fix the "Database error saving new user" and other authentication problems in the PAWfect App.

## Common Error: "Database error saving new user"

This error occurs when Supabase cannot save new user information to the database. Here's how to fix it:

### Step 1: Check Supabase Project Status

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Ensure your project is **active** and not paused
3. If paused, click "Resume" to reactivate

### Step 2: Verify Authentication Settings

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Check these settings:
   - **Enable email confirmations**: Should be enabled for production
   - **Enable phone confirmations**: Optional
   - **Site URL**: Should be `http://localhost:3000` for development
   - **Redirect URLs**: Should include `http://localhost:3000`

### Step 3: Configure Row Level Security (RLS)

The most common cause is missing RLS policies. Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable RLS on auth.users (if not already enabled)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own profile" ON auth.users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data  
CREATE POLICY "Users can update own profile" ON auth.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow new user registration
CREATE POLICY "Allow user registration" ON auth.users
  FOR INSERT WITH CHECK (true);
```

### Step 4: Check Database Schema

Ensure your database has the required tables. Run this in SQL Editor:

```sql
-- Check if breeds table exists (required for the app)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'breeds';

-- If breeds table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS breeds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  size VARCHAR(50),
  energy_level INTEGER,
  good_with_kids INTEGER,
  good_with_pets INTEGER,
  grooming_needs INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on breeds table
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;

-- Allow public read access to breeds
CREATE POLICY "Breeds are viewable by everyone" ON breeds
  FOR SELECT USING (true);
```

### Step 5: Verify Environment Variables

Check your `.env.local` file has correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: **Supabase Dashboard** → **Settings** → **API**

### Step 6: Test Your Configuration

1. Visit `/api/health` to check system status
2. Look for any configuration issues
3. All checks should show "ok" status

## Other Common Errors

### "Invalid API key" or "Project not found"
- Double-check your environment variables
- Ensure you're using the **anon public** key, not the service role key
- Verify your project URL is correct

### "Failed to fetch" or Network errors
- Check your internet connection
- Verify Supabase project is not paused
- Ensure your project URL is accessible

### "Email not confirmed"
- Check your spam folder for confirmation emails
- Ensure email confirmations are enabled in Supabase
- Try using a different email address

## Production Deployment

When deploying to production:

1. Update Site URL and Redirect URLs in Supabase to your production domain
2. Set environment variables in your hosting platform
3. Ensure your production domain is properly configured

## Still Having Issues?

1. Check the `/api/health` endpoint for detailed diagnostics
2. Review Supabase logs in your dashboard
3. Ensure all RLS policies are correctly configured
4. Contact support with specific error messages

## Quick Fix Commands

Run these in your Supabase SQL Editor if you're still having issues:

```sql
-- Reset and recreate basic RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON auth.users;
DROP POLICY IF EXISTS "Users can update own profile" ON auth.users;
DROP POLICY IF EXISTS "Allow user registration" ON auth.users;

-- Recreate policies
CREATE POLICY "Users can view own profile" ON auth.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON auth.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow user registration" ON auth.users
  FOR INSERT WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
```

This should resolve most "Database error saving new user" issues.