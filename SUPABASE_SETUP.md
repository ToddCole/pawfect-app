# Supabase Setup Guide for PAWfect App

This guide will help you set up Supabase authentication for the PAWfect App.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - Name: `pawfect-app` (or any name you prefer)
   - Database Password: Use a strong password
   - Region: Choose the closest region to you
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xyzabcdefghijklmnop.supabase.co`)
   - **Project API keys** → **anon public** (a long JWT token)

## Step 3: Configure Environment Variables

1. In your PAWfect App root directory, copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000`
4. Make sure **Enable email confirmations** is enabled
5. Configure your email templates if needed

## Step 5: Create Database Schema (Optional)

The app expects a `breeds` table. If you want to test with sample data:

1. Go to **SQL Editor** in your Supabase dashboard
2. Create the breeds table:
   ```sql
   CREATE TABLE breeds (
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
   ```

3. Insert some sample data:
   ```sql
   INSERT INTO breeds (name, description, size, energy_level, good_with_kids, good_with_pets, grooming_needs) VALUES
   ('Golden Retriever', 'Friendly and intelligent dog', 'Large', 4, 5, 5, 3),
   ('French Bulldog', 'Adaptable and playful', 'Small', 2, 4, 3, 2),
   ('Labrador', 'Outgoing and active', 'Large', 5, 5, 5, 2);
   ```

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/test-supabase` to verify your connection
3. You should see:
   - ✅ Connected
   - ✅ Supabase URL: Set
   - ✅ Supabase Anon Key: Set

4. Test authentication by visiting `http://localhost:3000/auth`

## Troubleshooting

### "Invalid URL" Error
- Double-check your `NEXT_PUBLIC_SUPABASE_URL` format
- Make sure it starts with `https://` and ends with `.supabase.co`

### "Invalid API Key" Error
- Verify you copied the **anon public** key, not the service role key
- Make sure there are no extra spaces or characters

### "Project not found" Error
- Ensure your Supabase project is active and not paused
- Check that you're using the correct project URL

### Authentication Issues
- Verify your Site URL and Redirect URLs in Supabase Auth settings
- Make sure email confirmations are properly configured
- Check your spam folder for magic link emails

## Production Deployment

When deploying to production:

1. Add your production domain to Supabase Auth settings
2. Set environment variables in your hosting platform
3. Update redirect URLs to use your production domain

For more help, visit the [Supabase Documentation](https://supabase.com/docs).