# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router, TypeScript, React 19, and Tailwind CSS 4. The project is configured with modern ESLint using the flat config format.

## Development Commands

- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint to check code quality

## Architecture

### Next.js App Router Structure

This project uses the Next.js App Router (not Pages Router). All routes are defined in the `app/` directory:

- `app/layout.tsx` - Root layout component that wraps all pages. Contains metadata configuration and font setup.
- `app/page.tsx` - Home page component (route: `/`)
- `app/globals.css` - Global styles with Tailwind CSS imports and theme configuration

### Styling Approach

The project uses **Tailwind CSS 4** with the PostCSS plugin approach:

- Global CSS variables are defined in `app/globals.css` using `:root` and `@theme inline`
- Two custom fonts are loaded via `next/font/google`: Geist Sans and Geist Mono
- Dark mode is handled through CSS variables with `prefers-color-scheme` media query
- Tailwind classes are used throughout components for styling

### TypeScript Configuration

- Path alias `@/*` maps to the root directory for cleaner imports
- Strict mode is enabled
- Target is ES2017
- React JSX transform is configured (`jsx: "react-jsx"`)

### ESLint Configuration

The project uses ESLint 9 with the flat config format (`eslint.config.mjs`):

- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores `.next/`, `out/`, `build/`, and `next-env.d.ts`

## Key Conventions

- All React components use TypeScript with proper typing
- Server Components by default (React Server Components)
- Use `next/image` for optimized image rendering
- Font optimization is handled through `next/font/google`
