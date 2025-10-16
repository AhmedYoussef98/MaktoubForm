# Maktoub Interest Registration Form

## Overview

This is a bilingual (Arabic/English) interest registration form application for the Maktoub AI system. It's built as a Node.js/Express web application that collects user interest data and stores it in both Supabase (primary database) and Google Sheets (secondary storage). The application features a modern, responsive UI with RTL (right-to-left) support for Arabic and includes form validation, IP tracking, and animated visual elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-page application** served as static HTML
- **RTL-first design** with Arabic as the primary language and English support
- **Responsive layout** using CSS Grid and Flexbox
- **Mobile-optimized** with touch-friendly interactions and appropriate meta viewport settings
- **Visual design**: Gradient backgrounds with animated decorative elements, custom fonts (Tajawal/Janna LT for Arabic)

### Backend Architecture
- **Framework**: Express.js server running on Node.js 18+
- **API Structure**: RESTful endpoint for form submissions
- **Middleware stack**:
  - CORS enabled for cross-origin requests
  - Body-parser for JSON request parsing
  - Static file serving for the public directory
- **Port configuration**: Configurable via environment variable (default: 5000)

### Data Storage Solutions
- **Primary database**: Supabase (PostgreSQL-based)
  - Stores form submissions with user details
  - Includes IP address tracking for submission metadata
  - Uses Supabase client library (@supabase/supabase-js v2.38.0)
  
- **Secondary storage**: Google Sheets
  - Parallel data storage for easy viewing and analysis
  - Uses Google Sheets API v4 via googleapis library
  - OAuth-based authentication through Replit Connectors

### Authentication & Authorization
- **Supabase authentication**: Uses service_role key for backend server operations (bypasses RLS)
- **Google Sheets authentication**: OAuth 2.0 flow managed through Replit's connector system
  - Token caching with expiration checking
  - Automatic token refresh logic
  - Support for both repl and deployment contexts (REPL_IDENTITY and WEB_REPL_RENEWAL)
  - Fresh OAuth2 client instantiated per write operation

### Design Patterns
- **Dual-write pattern**: Data is written to both Supabase and Google Sheets simultaneously for redundancy
  - Supabase write is primary and blocking (must succeed)
  - Google Sheets write is secondary and non-blocking (failures are logged but don't affect response)
- **Environment-based configuration**: Different credential handling for local development vs. Replit deployment
- **Token management**: Cached access tokens with expiration validation to minimize API calls
- **Fire-and-forget pattern**: Google Sheets sync failures are logged but don't block the success response

## External Dependencies

### Third-party Services
1. **Supabase**
   - Purpose: Primary database and backend-as-a-service
   - Configuration: Requires SUPABASE_URL and SUPABASE_KEY environment variables
   - Project URL: https://omwubivvniolmamrkewu.supabase.co

2. **Google Sheets API**
   - Purpose: Secondary data storage and visualization
   - Configuration: Requires GOOGLE_SHEET_ID and Replit connector authentication
   - Authentication: OAuth 2.0 via Replit Connectors API
   - Requires REPLIT_CONNECTORS_HOSTNAME for connector communication

### NPM Packages
- **@supabase/supabase-js** (v2.38.0): Supabase client library
- **express** (v4.18.2): Web application framework
- **cors** (v2.8.5): CORS middleware
- **body-parser** (v1.20.2): Request body parsing
- **googleapis** (v163.0.0): Google APIs client library

### Font Resources
- **Google Fonts**: Tajawal font family for Arabic typography
- **System fallbacks**: Janna LT, -apple-system, BlinkMacSystemFont, Segoe UI

### Environment Variables
**Required for operation:**
- `SUPABASE_URL`: Supabase project URL (https://omwubivvniolmamrkewu.supabase.co)
- `SUPABASE_KEY`: Supabase service_role key (for backend server, bypasses RLS)
- `GOOGLE_SHEET_ID`: Target Google Sheets spreadsheet ID (created via setup-google-sheet.js)
- `PORT`: Server port (fixed at 5000 for Replit compatibility)

**Replit-specific (for deployment):**
- `REPLIT_CONNECTORS_HOSTNAME`: Replit connectors API endpoint
- `REPL_IDENTITY` or `WEB_REPL_RENEWAL`: Authentication tokens for connector access