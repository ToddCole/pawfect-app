-- Create quiz results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NULL, -- NULL for guest users
  session_id text, -- For guest users to claim results later
  answers jsonb NOT NULL,
  matches jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_guest boolean DEFAULT false
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON public.quiz_results(created_at);

-- Enable RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Users can view their own results
CREATE POLICY "Users can view own quiz results" ON public.quiz_results
  FOR SELECT USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_id IS NOT NULL) -- Guest results accessible by session
  );

-- Users can insert their own results
CREATE POLICY "Users can insert quiz results" ON public.quiz_results
  FOR INSERT WITH CHECK (
    (auth.uid() = user_id) OR 
    (auth.uid() IS NULL AND is_guest = true) -- Allow guest results
  );

-- Users can update their own results
CREATE POLICY "Users can update own quiz results" ON public.quiz_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all results for analytics
CREATE POLICY "Admins can view all quiz results" ON public.quiz_results
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to claim guest results when user signs up
CREATE OR REPLACE FUNCTION public.claim_guest_quiz_results(session_id_param text)
RETURNS void AS $$
BEGIN
  UPDATE public.quiz_results
  SET 
    user_id = auth.uid(),
    is_guest = false,
    updated_at = now()
  WHERE 
    session_id = session_id_param 
    AND user_id IS NULL 
    AND is_guest = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user favorites table (for saving favorite breeds)
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  breed_id uuid REFERENCES public.breeds(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, breed_id)
);

-- Enable RLS on favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Update the handle_new_user function to claim guest results
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Claim any guest quiz results if session_id is provided
  IF new.raw_user_meta_data->>'session_id' IS NOT NULL THEN
    PERFORM public.claim_guest_quiz_results(new.raw_user_meta_data->>'session_id');
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;