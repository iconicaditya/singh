# Next.js Application

## Overview
A Next.js 15 application with React 19, TypeScript, and Tailwind CSS.

## Project Structure
- `app/` - Next.js App Router pages and layouts
- `public/` - Static assets (images, icons)
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `lib/` - Shared libraries (database, cloudinary)
- `components/` - Reusable UI components

## Development
- **Port**: 5000 (frontend)
- **Command**: `npm run dev`
- Uses Turbopack for fast development builds

## Research Management
- **Database**: Neon PostgreSQL via Drizzle ORM
- **Media**: Cloudinary for images
- **Flow**: Admin Dashboard -> API Routes -> Database -> Frontend Research Gallery

## Deployment
- **Build**: `npm run build`
- **Start**: `npm run start`
- Configured for autoscale deployment on Replit and compatible with Vercel deployment.
