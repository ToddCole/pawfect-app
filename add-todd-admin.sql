-- Step 3: Add Todd as admin
INSERT INTO public.profiles (id, email, role)
SELECT u.id, u.email, 'admin'
FROM auth.users u
WHERE u.email = 'todd@mensfitnessonline.com.au'
ON CONFLICT (id) DO UPDATE SET role = 'admin';