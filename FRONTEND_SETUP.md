# Frontend Setup Guide

## Required Environment Variables

Create a `.env.local` file in the `autodig-frontend/` directory with:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id-here"

# Backend Configuration
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"

# Supabase Configuration (if still using)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url-here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
```

## Features Added

### 1. Google OAuth Authentication
- Google Sign-In button on login and signup pages
- Automatic user creation/linking with Google accounts
- JWT token storage in localStorage

### 2. Enhanced Login/Signup Pages
- Client-side form handling with error/success messages
- Loading states for better UX
- Form validation and error handling

### 3. API Routes
- `/api/login` - Handles email/password login
- `/api/signup` - Handles user registration
- `/api/auth/google` - Handles Google OAuth

### 4. Authentication Flow
- JWT tokens stored in localStorage
- Automatic redirect to dashboard after login
- Client-side sign out functionality

## Usage

1. **Email/Password Login**: Users can login with email and password
2. **Google OAuth**: Users can login with their Google account
3. **Signup**: New users can create accounts with email/password or Google
4. **Automatic Redirect**: Successful login redirects to dashboard

## Components

- `GoogleSignIn` - Reusable Google Sign-In component
- `clientActions` - Client-side authentication functions
- `googleAuth` - Google OAuth utility functions

## API Integration

The frontend now communicates with your backend API at `http://localhost:3001` for:
- User authentication
- Google OAuth verification
- User registration

Make sure your backend is running and the environment variables are properly configured. 