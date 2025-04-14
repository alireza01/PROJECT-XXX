-- Create gemini_api_keys table
CREATE TABLE IF NOT EXISTS public.gemini_api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL
);

-- Create ai_interactions table
CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    model TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gemini_api_keys_user_id ON public.gemini_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON public.ai_interactions(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.gemini_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for gemini_api_keys
CREATE POLICY "Users can view their own API keys and public ones"
    ON public.gemini_api_keys
    FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own API keys"
    ON public.gemini_api_keys
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
    ON public.gemini_api_keys
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
    ON public.gemini_api_keys
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for prompts
CREATE POLICY "Users can view their own prompts and public ones"
    ON public.prompts
    FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own prompts"
    ON public.prompts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
    ON public.prompts
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts"
    ON public.prompts
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for ai_interactions
CREATE POLICY "Users can view their own AI interactions"
    ON public.ai_interactions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI interactions"
    ON public.ai_interactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id); 