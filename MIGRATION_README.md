# Star Wars Collectors - Vite to Next.js Migration

## What's Been Done

✅ **Project Structure Updated**

- Converted from Vite to Next.js App Router
- Updated `package.json` with Next.js dependencies
- Created `next.config.js` with proper configuration
- Updated `tsconfig.json` for Next.js compatibility

✅ **Routing Migration**

- Replaced React Router with Next.js App Router
- Created `/src/app/layout.tsx` as the root layout
- Created `/src/app/page.tsx` as the home page
- Created `/src/app/category/[categoryId]/page.tsx` for category pages
- Created `/src/app/item/[itemId]/page.tsx` for item detail pages
- Created `/src/app/not-found.tsx` for 404 pages

✅ **Component Updates**

- Updated `CategoryPage.tsx` to accept `categoryId` as prop
- Updated `ItemDetailsPage.tsx` to accept `itemId` as prop
- Replaced `useNavigate` with `useRouter` from Next.js
- Replaced `useParams` with Next.js `useParams`
- Added `'use client'` directive to client components

✅ **Supabase Integration**

- Updated Supabase client to use Next.js environment variables
- Changed from `import.meta.env` to `process.env`

✅ **Styling**

- Moved global CSS to `/src/app/globals.css`
- Updated Tailwind config for Next.js paths

## Next Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Update Cloudflare R2 Configuration

If you're using Cloudflare R2 for image storage, update the `next.config.js` file with your actual R2 domain:

```javascript
images: {
  domains: ['your-actual-r2-domain.com'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-actual-r2-domain.com',
      port: '',
      pathname: '/**',
    },
  ],
},
```

### 4. Test the Application

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Key Changes Made

### Routing Changes

- **Before**: `react-router-dom` with `<BrowserRouter>` and `<Routes>`
- **After**: Next.js App Router with file-based routing

### Navigation Changes

- **Before**: `useNavigate()` from React Router
- **After**: `useRouter()` from Next.js

### Environment Variables

- **Before**: `import.meta.env.VITE_*`
- **After**: `process.env.NEXT_PUBLIC_*`

### Component Structure

- **Before**: All components in `/src/pages/`
- **After**: Page components in `/src/app/` with route structure

## Files That Need Your Attention

1. **Environment Variables**: Update `.env.local` with your actual Supabase credentials
2. **Cloudflare R2**: Update `next.config.js` with your actual R2 domain
3. **Image Optimization**: Consider using Next.js `<Image>` component for better performance

## Benefits of the Migration

✅ **Better Performance**: Automatic code splitting and optimization
✅ **SEO Friendly**: Server-side rendering capabilities
✅ **Built-in Image Optimization**: Next.js `<Image>` component
✅ **Better Developer Experience**: File-based routing and hot reloading
✅ **Production Ready**: Optimized builds and deployment

## Troubleshooting

If you encounter any issues:

1. **TypeScript Errors**: Make sure all imports are correct
2. **Environment Variables**: Ensure they start with `NEXT_PUBLIC_` for client-side access
3. **Routing Issues**: Check that all page components have `'use client'` directive
4. **Build Errors**: Run `npm run build` to identify any issues

## Deployment

The app is now ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Cloudflare Pages**

All deployment platforms will automatically detect Next.js and configure the build process.
