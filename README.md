# MindHealth AI

A Next.js mental wellness app built with Firebase and Genkit.

## Deploying to Vercel

Set these environment variables in your Vercel project settings before deploying:

### Firebase (recommended)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### AI (recommended)
- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`)

If Firebase variables are not set, the app now falls back to mock data so builds can still complete.
