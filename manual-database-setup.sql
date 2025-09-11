-- Manual Database Setup for Pawfect App
-- Run this directly in your Supabase SQL Editor

-- 1. Drop all existing policies and tables to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can insert quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can update own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Admins can view all quiz results" ON public.quiz_results;

DROP TABLE IF EXISTS public.quiz_results CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Create profiles table (without RLS for now)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create quiz_results table (without RLS for now)
CREATE TABLE public.quiz_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NULL,
  session_id text,
  answers jsonb NOT NULL,
  matches jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_guest boolean DEFAULT false
);

-- 4. Create indexes for better performance
CREATE INDEX idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX idx_quiz_results_session_id ON public.quiz_results(session_id);
CREATE INDEX idx_quiz_results_created_at ON public.quiz_results(created_at);

-- 5. Create profile for Todd as admin
INSERT INTO public.profiles (id, email, role)
SELECT auth.users.id, auth.users.email, 'admin'
FROM auth.users
WHERE auth.users.email = 'todd@mensfitnessonline.com.au'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 6. Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Note: RLS is intentionally disabled for now to get the app working
-- You can enable RLS later once everything is functional