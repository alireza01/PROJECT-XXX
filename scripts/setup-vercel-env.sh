#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if project is linked
if ! vercel project ls | grep -q "$(basename "$PWD")"; then
    echo "Project is not linked to Vercel. Please link it first:"
    echo "vercel link"
    exit 1
fi

# Set environment variables
echo "Setting up environment variables in Vercel..."

# Supabase Configuration
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Google OAuth Configuration
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET

# Google AI Configuration
vercel env add GOOGLE_AI_API_KEY

# App Configuration
vercel env add NEXT_PUBLIC_APP_URL

echo "Environment variables setup complete!"
echo "Please make sure to set the correct values for each variable in the Vercel dashboard." 