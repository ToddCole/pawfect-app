-- Fix Todd's admin status in the existing profiles table structure

-- First, check if Todd already has a profile
SELECT p.*, u.email 
FROM public.profiles p
RIGHT JOIN auth.users u ON p.user_id = u.id 
WHERE u.email = 'todd@mensfitnessonline.com.au';

-- Insert or update Todd's profile to make him admin
INSERT INTO public.profiles (user_id, is_admin, created_at)
SELECT u.id, true, now()
FROM auth.users u
WHERE u.email = 'todd@mensfitnessonline.com.au'
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;

-- Verify Todd is now admin
SELECT p.*, u.email 
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id 
WHERE u.email = 'todd@mensfitnessonline.com.au';