# PAWfect App

A Next.js dog breed matching and exploration application with Supabase backend integration.

## 🚨 CRITICAL ISSUE - AUTH SIGNUP FAILING

**Current Status**: User signup completely broken with Supabase 500 errors
**Error**: `Database error saving new user` - AuthApiError 500 "unexpected_failure"
**Need**: Developer to fix Supabase database triggers/configuration

### Authentication System Status:
- ✅ **Login Works**: Existing users can sign in (todd@mensfitnessonline.com.au)
- ❌ **Signup Broken**: New user creation fails with 500 error from Supabase
- ✅ **Auth Context**: Global auth state management implemented
- ✅ **Admin System**: Hardcoded admin access for todd@mensfitnessonline.com.au
- ❌ **Profile Creation**: Database triggers failing during user creation

## Features

- **Dog Breed Matching Quiz**: Intelligent breed recommendation system
- **Comprehensive Breed Database**: 279+ dog breeds with detailed characteristics
- **Admin Breed Management**: Full CRUD interface for breed data (working)
- **User Authentication**: Supabase auth integration (login works, signup broken)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Navigation System**: Global navigation with auth state integration

## Pages

- `/` - Homepage with breed matching quiz
- `/breeds` - Browse all dog breeds with filtering
- `/breeds/[id]` - Individual breed detail pages
- `/guides` - Dog care guides and tips
- `/about` - About page with team information
- `/auth` - Authentication page (signup broken)
- `/dashboard` - User dashboard (works)
- `/breed-manager` - Admin breed management interface (works)
- `/test-auth` - Debug tool for testing auth issues

## Admin System

- **Working**: Full breed management at `/breed-manager`
- **Admin User**: todd@mensfitnessonline.com.au (hardcoded admin access)
- **Features**: Create, edit, delete breeds with all 41+ fields
- **Access**: Admin button appears in navigation when signed in as admin

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
Create a `.env.local` file with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔥 TECHNICAL DEBT AND ISSUES

### Immediate Fixes Needed:
1. **Supabase Auth 500 Error**: Database trigger failing during user signup
2. **Profile Creation**: Missing or broken database triggers/policies
3. **Database Schema**: Profiles table may have wrong structure or missing policies

### Attempted Fixes (Failed):
- ❌ Disabled email confirmations in Supabase
- ❌ Created basic profiles table with RLS policies  
- ❌ Added profile creation in auth context
- ❌ Enhanced error handling in signup flow
- ❌ Disabled database triggers (still failing)

### Debug Tools Created:
- **`/test-auth`**: Isolated auth testing tool showing exact 500 error
- **Enhanced logging**: Console logging throughout auth flow
- **Error details**: Full AuthApiError details captured

### Supabase Configuration:
- **Project**: cowzzajbwtqfmrocefaw.supabase.co
- **Environment**: .env.local configured correctly
- **Connection**: ✅ Working (can read/write breed data)
- **Auth Login**: ✅ Working for existing users
- **Auth Signup**: ❌ 500 Internal Server Error

## Database Schema

### Breeds Table (Working):
Complete breed information with 41+ fields including:
- `id`, `name`, `size`, `breed_group`
- Physical: `weight_min/max`, `height_min/max`, `lifespan_min/max`
- Behavioral: `energy_level`, `good_with_kids`, `training_ease`, etc. (1-5 scale)
- Text: `description`, `temperament`, `exercise_needs`, etc.

### Profiles Table (Broken):
Expected structure for user profiles:
```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Architecture Overview

### Auth System:
- **Global Context**: `contexts/auth-context.tsx` - Manages auth state
- **Hardcoded Admin**: todd@mensfitnessonline.com.au bypasses database checks
- **Profile Creation**: Attempts to create profile on signup (failing)
- **Middleware**: `middleware.ts` - Protects admin routes

### Key Files:
- **`app/auth/page.tsx`**: Auth page with enhanced error handling
- **`app/breed-manager/`**: Complete admin CRUD interface (working)
- **`app/test-auth/page.tsx`**: Debug tool for auth issues
- **`contexts/auth-context.tsx`**: Global auth state management
- **`lib/supabase-client.ts`**: Supabase client configuration

## 🎯 FOR NEXT DEVELOPER

### What Works:
1. **Breed Management**: Full admin interface at `/breed-manager` (create/edit/delete breeds)
2. **User Login**: Existing users can sign in successfully
3. **Admin Access**: todd@mensfitnessonline.com.au gets admin privileges
4. **Breed Quiz**: Homepage recommendation engine works
5. **Navigation**: Global auth-aware navigation system

### What's Broken:
1. **New User Signup**: Supabase returns 500 "Database error saving new user"
2. **Profile Creation**: Database trigger/constraint failing during auth.signUp()

### Investigation Results:
- ✅ Supabase connection working (can read/write breed data)
- ✅ Auth tokens valid (login works)
- ❌ Database trigger/function failing on user creation
- ❌ Error happens server-side in Supabase, not our code

### Next Steps for Fix:
1. **Check Supabase Dashboard** → Functions → Find failing trigger
2. **Inspect auth.users table** permissions and constraints  
3. **Check Database logs** in Supabase for actual SQL error
4. **Consider**: Disable all triggers temporarily to isolate issue
5. **Alternative**: Create manual profile creation after successful signup

### Error Details:
```
AuthApiError: Database error saving new user
Status: 500
Code: "unexpected_failure" 
URL: cowzzajbwtqfmrocefaw.supabase.co/auth/v1/signup
```

## Scripts

- `npm run dev` - Start development server (runs on port 3005)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment

Current environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://cowzzajbwtqfmrocefaw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[working key]
SUPABASE_SERVICE_ROLE_KEY=[working key]
```
