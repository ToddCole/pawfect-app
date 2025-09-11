-- Fix the profiles table to use proper role-based structure

-- 1. Drop the old table completely
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Create the correct profiles table structure
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Todd's profile as admin
INSERT INTO public.profiles (id, email, role)
SELECT u.id, u.email, 'admin'
FROM auth.users u
WHERE u.email = 'todd@mensfitnessonline.com.au'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 4. Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    CASE 
      WHEN new.email = 'todd@mensfitnessonline.com.au' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger for new signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verify the setup
SELECT p.*, u.email as user_email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id 
WHERE u.email = 'todd@mensfitnessonline.com.au';