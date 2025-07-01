# FormBuilder Pro - Deployment Guide

## Overview
A comprehensive form builder web application with admin dashboard, user management, and dynamic form creation.

## Features
- Admin and user authentication with role-based access
- Dynamic form builder with drag-and-drop interface
- User and customer management system
- Form submission tracking and analytics
- CSV export functionality
- Responsive design with modern UI

## Quick Deploy Options

### 1. Railway (Recommended - Free Forever)
- ✅ Free PostgreSQL database (500MB)
- ✅ Free hosting with custom domain
- ✅ Automatic deployments from GitHub

**Deploy Steps:**
1. Push code to GitHub repository
2. Go to [railway.app](https://railway.app)
3. Connect your GitHub account
4. Deploy from repository
5. Add environment variables (see below)

### 2. Render + Supabase
- ✅ Free web hosting on Render
- ✅ Free PostgreSQL on Supabase (500MB)

### 3. Vercel + PlanetScale
- ✅ Free frontend hosting on Vercel
- ✅ Free MySQL database on PlanetScale (5GB)

## Environment Variables Required
```
DATABASE_URL=your_database_connection_string
SESSION_SECRET=your_random_secret_key
REPL_ID=your_app_id
REPLIT_DOMAINS=your_domain.com
ISSUER_URL=https://replit.com/oidc
```

## Database Setup
The app automatically creates all required tables:
- users (authentication)
- customers (customer management)
- forms (form definitions)
- form_submissions (form responses)
- sessions (user sessions)
- user_form_mappings (form assignments)

## Local Development
```bash
npm install
npm run dev
```

## Build for Production
```bash
npm run build
npm start
```

## Admin Access
- First user to sign up becomes admin
- Admin can create forms, manage users, and view analytics
- Regular users can fill assigned forms

## Support
For deployment help, check the platform-specific guides below.