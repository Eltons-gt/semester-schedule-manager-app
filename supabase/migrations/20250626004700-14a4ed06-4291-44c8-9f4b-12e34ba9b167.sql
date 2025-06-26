
-- Create a table to store courses with user relationships
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  instructor TEXT,
  location TEXT,
  days TEXT[] NOT NULL, -- Array of day abbreviations like ['Mon', 'Wed', 'Fri']
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) to ensure users can only see their own courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own courses
CREATE POLICY "Users can view their own courses" 
  ON public.courses 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own courses
CREATE POLICY "Users can create their own courses" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own courses
CREATE POLICY "Users can update their own courses" 
  ON public.courses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own courses
CREATE POLICY "Users can delete their own courses" 
  ON public.courses 
  FOR DELETE 
  USING (auth.uid() = user_id);
