# Maktoub Interest Registration Form

A bilingual (Arabic/English) interest registration form for the Maktoub AI system, built with Node.js/Express and Supabase.

## Features

- 🌐 Bilingual interface (Arabic RTL + English)
- 📱 Fully responsive design
- ⚡ Fast Express.js backend
- 🗄️ Supabase database integration
- 🎨 Modern UI with animations
- 🔒 Form validation and security

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and anon key from Settings > API

### 2. Environment Configuration

**For Local Development:**
1. Copy `.env.example` to `.env` (already included with your credentials)
2. Your Supabase credentials are pre-configured:
   ```
   SUPABASE_URL=https://omwubivvniolmamrkewu.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   PORT=3000
   ```

**For Replit Deployment:**
Add these environment variables in Replit Secrets:
- `SUPABASE_URL`: https://omwubivvniolmamrkewu.supabase.co  
- `SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9td3ViaXZ2bmlvbG1hbXJrZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NzE4MzUsImV4cCI6MjA3NjE0NzgzNX0.ZJBStzJcCSbGwwfs7OEJntR-bgfL9wp8Vqgv4uupTPw

### 3. Local Development

```bash
npm install
npm start
```

Visit `http://localhost:3000` to see the form.

### 4. Replit Deployment

1. Import this project to Replit
2. Add environment variables in Replit Secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Click "Run" to start the application
4. Use the provided Replit URL to access your form

## File Structure

```
├── index.js                 # Express server
├── package.json            # Dependencies
├── .replit                 # Replit configuration
├── supabase-schema.sql     # Database schema
├── .env.example           # Environment template
└── public/
    └── index.html         # Main form page
```

## API Endpoints

- `GET /` - Serves the registration form
- `POST /api/register` - Handles form submissions
- `GET /api/health` - Health check endpoint

## Database Schema

The `interest_registrations` table stores:
- User information (name, email, phone)
- Interest type and details
- Timestamp and IP address
- UUID primary key

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Hosting**: Replit
- **Styling**: Custom CSS with RTL support