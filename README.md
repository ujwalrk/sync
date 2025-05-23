# Sync - AI-Powered Meeting Assistant

Sync is a web application that automatically transcribes and summarizes your meetings in real-time. Using Google's Gemini AI, it helps you capture and organize key points from conversations without taking manual notes.

## Features

- 🎙️ Real-time voice recording and transcription
- 🤖 AI-powered meeting summaries using Google's Gemini
- 📝 Structured summaries with general points and individual contributions
- 🔒 Secure authentication and data storage
- 📱 Responsive design for all devices

## Tech Stack

- Next.js (App Router)
- React
- Material-UI
- Supabase (Auth & Database)
- Google Gemini AI
- Web Speech API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Sign up or log in to your account
2. Click "Start Recording" to begin capturing your meeting
3. Speak naturally - Sync will transcribe in real-time
4. Click "Stop Recording" when finished
5. View your AI-generated summary with key points and individual contributions

## License

MIT
