-- Debug authentication and profiles
-- Run this in Supabase SQL Editor to check current state

-- 1. Check if profiles table exists and its structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check current user data
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'todd@mensfitnessonline.com.au';

-- 3. Check profiles data
SELECT * FROM public.profiles;

-- 4. Check if Todd has a profile with admin role
SELECT p.*, u.email 
FROM public.profiles p
JOIN auth.users u ON p.id = u.id 
WHERE u.email = 'todd@mensfitnessonline.com.au';