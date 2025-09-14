# PAWfect App

A Next.js dog breed explorer application with Supabase backend integration.

## Features

- **Dog Breed Browser**: View all dog breeds with detailed information
- **Random Breed Discovery**: Get redirected to a random breed for exploration
- **Supabase Integration**: Backend powered by Supabase for breed data storage
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly experience
- **API Endpoints**: RESTful API for breed data access

## Pages

- `/` - Home page
- `/breeds` - Browse all dog breeds
- `/breeds/[id]` - Individual breed detail pages with descriptions and image placeholders
- `/breeds/sample` - Redirects to a random breed (perfect for discovery)
- `/auth` - Authentication page
- `/test-supabase` - Supabase connection testing and diagnostics

## API Endpoints

- `/api/ping` - Health check endpoint with breed count
- `/api/first-breed` - Returns the first breed in the database
- `/api/test-breed/[id]` - Dynamic breed API endpoint

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Database**: Supabase with PostgreSQL
- **Styling**: Tailwind CSS 4.0
- **TypeScript**: Full TypeScript support
- **Authentication**: Supabase Auth integration

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
Create a `.env.local` file with your Supabase credentials:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Where to find these values:**
- Go to your [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Navigate to Settings → API
- Copy the "Project URL" and "Project API keys" → "anon public"

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Visit [http://localhost:3000](http://localhost:3000) to see the application.

5. **Test your setup**:
Visit [http://localhost:3000/test-supabase](http://localhost:3000/test-supabase) to verify your Supabase connection.

## Database Schema

The application expects a `breeds` table in Supabase with the following structure:
- `id` - Primary key
- `name` - Breed name
- Additional fields for breed information (description, characteristics, etc.)

## Navigation

The application includes a footer navigation with:
- **Main Navigation**: Home, All Breeds, Random Breed, Auth
- **Testing Links**: Supabase Test, API endpoints
- **Branding**: PAWfect App logo and description

## Development Notes

- Uses `@supabase/ssr` for server-side rendering with Supabase
- Implements proper error handling and loading states
- Random breed selection uses client-side randomization for better UX
- Footer navigation provides easy access to all features during development

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### Authentication Issues

If you're seeing "Error: Database error saving new user" or similar authentication errors:

1. **Check Environment Variables**: Visit `/test-supabase` to verify your Supabase configuration
2. **Verify Credentials**: Ensure your Supabase URL and anon key are correct
3. **Check Supabase Project**: Make sure your Supabase project is active and accessible
4. **Authentication Settings**: In your Supabase dashboard, check that email authentication is enabled

### Common Error Messages

- **"Your project's URL and API key are required"**: Missing environment variables in `.env.local`
- **"Database error saving new user"**: Usually indicates Supabase connection issues
- **Build fails with font errors**: Network connectivity issue (fonts will fallback in dev mode)
