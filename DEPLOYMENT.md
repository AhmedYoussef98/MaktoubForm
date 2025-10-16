# Quick Deployment Guide

## 🚀 One-Click Replit Deployment

Your project is ready to deploy! Here's how:

### Option 1: Import from GitHub to Replit

1. **Upload to GitHub** (if not done already):
   - Create a new repo called `maktoubform`
   - Upload all files from this folder

2. **Import to Replit**:
   - Go to [replit.com](https://replit.com)
   - Click "Create Repl" → "Import from GitHub"
   - Enter: `yourusername/maktoubform`

3. **Add Environment Variables**:
   - In Replit, go to "Secrets" (lock icon)
   - Add these two secrets:
     ```
     SUPABASE_URL = https://omwubivvniolmamrkewu.supabase.co
     SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9td3ViaXZ2bmlvbG1hbXJrZXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NzE4MzUsImV4cCI6MjA3NjE0NzgzNX0.ZJBStzJcCSbGwwfs7OEJntR-bgfL9wp8Vqgv4uupTPw
     ```

4. **Launch**:
   - Click the green "Run" button
   - Your form will be live at the provided Replit URL!

### Option 2: Local Testing

```bash
npm install
npm start
```

Visit `http://localhost:3000`

## ✅ What's Included

- ✅ Express.js server with API endpoint
- ✅ Supabase database integration
- ✅ Bilingual Arabic/English form
- ✅ IP address tracking
- ✅ Mobile-responsive design
- ✅ Environment variables configured
- ✅ Replit deployment ready

## 📝 Notes

- Database table is already created in your Supabase project
- All environment variables are pre-configured
- Form submissions will automatically save to your Supabase database
- IP addresses are captured silently like your original Google Apps Script