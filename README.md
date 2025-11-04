# Next.js Pet Adoption App

A Next.js application that fetches and displays adoptable pets from the PetFinder API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with your PetFinder API credentials:
```
PETFINDER_API_KEY=your-api-key-here
PETFINDER_API_SECRET=your-api-secret-here
```

You can get your API key and secret from [PetFinder Developers](https://www.petfinder.com/developers/).

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- List view of adoptable pets with images and bios
- Individual pet detail pages with comprehensive information
- Error handling for API failures
- Responsive design with clean styling
- Server-side rendering for optimal performance

## Project Structure

- `app/` - Next.js App Router pages and components
- `lib/petfinder.ts` - PetFinder API integration utilities
- `app/page.tsx` - Main pets listing page
- `app/pet/[id]/page.tsx` - Individual pet detail page

