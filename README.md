markdown
# Hira Muslim Association Website

## 📋 Overview

A modern, full-stack website for Hira Muslim Association, featuring event registration, membership management, and an admin dashboard. Built with Next.js 16, Supabase for authentication and database, Tailwind CSS for styling, and shadcn/ui components.

### 🌟 Live Demo

**[View Live Website](https://vercel.com/neziraworku198-gmailcoms-projects/v0-hira-muslim-association-website)**

## ✨ Features

### Public Pages
- **Homepage** - Hero section, about, activities, upcoming events preview, membership CTA, and contact form
- **Events** - Graduation ceremony and annual exhibition pages with registration
- **Membership** - Join association with detailed application form
- **Contact** - Contact information and messaging form

### Event Registration System
- **Graduation Ceremony Registration** - Collect student information, academic details, and payment receipt
- **Exhibition Registration** - Two registration paths (exhibitor/facilitator or guest/company owner)
- **Membership Applications** - Full application with area of interest selection

### Admin Dashboard (Protected)
- **Posts Management** - Create, edit, and delete announcements
- **Registrations Overview** - View all event registrations by type
- **Protected Routes** - Supabase authentication required

### Technical Features
- ✅ Dark mode by default with theme toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Image carousels with autoplay
- ✅ Form validation with Zod
- ✅ Toast notifications for user feedback
- ✅ Backend webhook integration for form submissions
- ✅ Accessibility compliant (ARIA labels, keyboard navigation)

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4, shadcn/ui |
| **Authentication** | Supabase Auth |
| **Database** | Supabase PostgreSQL |
| **Form Handling** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Components** | Radix UI primitives |
| **Deployment** | Vercel |

## 📁 Project Structure
hira-portfolio/
├── src/
│ ├── app/
│ │ ├── (marketing)/ # Public routes
│ │ │ ├── page.tsx # Homepage
│ │ │ ├── events/ # Events pages
│ │ │ ├── membership/ # Membership page
│ │ │ └── contact/ # Contact page
│ │ ├── admin/ # Protected admin routes
│ │ │ ├── page.tsx # Dashboard
│ │ │ ├── posts/ # Blog posts CRUD
│ │ │ └── registrations/ # View registrations
│ │ ├── auth/login/ # Authentication
│ │ └── api/submissions/ # Form submission endpoint
│ ├── components/
│ │ ├── marketing/ # Homepage sections
│ │ ├── admin/ # Admin components
│ │ ├── shared/ # Navbar, footer, theme toggle
│ │ └── ui/ # shadcn/ui primitives
│ ├── lib/
│ │ └── supabase/ # Supabase clients
│ └── hooks/ # Custom React hooks
├── public/ # Static assets
└── scripts/ # Database setup scripts

text

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18 or higher
- npm, pnpm, or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Jennah198/hira-portfolio.git
cd hira-portfolio
Install dependencies

bash
npm install
# or
pnpm install
Set up environment variables

bash
cp .env.example .env.local
Fill in your environment variables (see Environment Variables section).

Set up Supabase

Run the SQL scripts in scripts/001_create_tables.sql in your Supabase SQL editor to create:

registrations table

posts table

RLS policies

Run development server

bash
npm run dev
Open http://localhost:3000

🔧 Environment Variables
Create a .env.local file:

env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Webhook Integration (Optional)
SUBMISSION_WEBHOOK_URL=https://your-backend.com/api/submit
SUBMISSION_WEBHOOK_TOKEN=your_secret_token

# Rate Limiting (Optional - for API routes)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
📝 Available Scripts
Command	Description
npm run dev	Start development server with hot reload
npm run build	Create production build
npm run start	Start production server
npm run lint	Run ESLint for code quality
npm run lint:fix	Auto-fix linting issues

🔐 Authentication & Security
Admin Access
Default admin route: /admin

Create first admin user through Supabase Auth

Middleware protects all /admin/* routes

RLS Policies
Database is secured with Row Level Security:

Anyone can insert registrations

Only authenticated users can view registrations

Only admins can manage posts

📱 Key Features Documentation
Form Submissions
All forms submit to /api/submissions which:

Validates input with Zod

Optionally forwards to external webhook

Logs to server console (fallback)

Returns success/failure response

Event Registration Types
Graduation: Full name, school, phone, telegram, ID card, email (optional), address, payment receipt

Exhibition: Two paths - Exhibitor (project details) or Guest (company details)

Membership: Complete application with area of interest

Dark Mode
Defaults to dark mode

Toggle via theme button in navbar

Persists across sessions using next-themes

Support & Contact
For issues or questions:

Create an issue in the repository

