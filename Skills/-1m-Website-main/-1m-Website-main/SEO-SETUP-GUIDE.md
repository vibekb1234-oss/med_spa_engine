# SEO Infrastructure Setup Guide

## Overview

Your website now has a complete SEO infrastructure including:
- ✅ Dynamic routing for blog and articles
- ✅ Full SEO meta tags (title, description, OG, Twitter Cards)
- ✅ JSON-LD structured data (Organization, WebSite, Article, Breadcrumbs)
- ✅ Auto-generating sitemap.xml
- ✅ Robots.txt configuration
- ✅ Internal linking and breadcrumbs
- ✅ Content management system

## File Structure

```
/
├── components/
│   ├── SEO.tsx                 # Reusable SEO component
│   ├── HomePageSEO.tsx         # Homepage structured data
│   ├── BlogPage.tsx            # Blog index with filtering
│   ├── ArticlePage.tsx         # Individual article template
│   └── Footer.tsx              # Updated with blog link
├── utils/
│   ├── articles.ts             # Article data management
│   └── sitemap.ts              # Sitemap generator
├── content/
│   └── articles/
│       └── TEMPLATE.md         # Template for new articles
├── public/
│   ├── sitemap.xml             # Generated sitemap
│   └── robots.txt              # Search engine instructions
└── App.tsx                     # Main routing
```

## How to Add New Articles

### Method 1: Edit the articles.ts file (Current Setup)

1. Open `/utils/articles.ts`
2. Add your article to the `SAMPLE_ARTICLES` array:

```typescript
{
  title: "Your Article Title",
  description: "Your article description for SEO",
  date: "2025-01-18",
  author: "Jack Roberts",
  image: "/Logo/hero-graphic.png",
  category: "LinkedIn Strategy",
  tags: ["LinkedIn", "Lead Generation"],
  slug: "your-article-url-slug",
  published: true,
  content: `
# Your Article Title

Your content here in markdown format...

## Section 1

Content...

## Section 2

More content...
  `
}
```

3. Save the file
4. Your article will automatically appear at `/blog/your-article-url-slug`

### Method 2: Future - MDX/Markdown Files (Recommended for Scale)

For a production CMS setup, consider:

**Option A: Local MDX Files**
- Install `@mdx-js/react` and `@mdx-js/loader`
- Store articles as `.mdx` files in `/content/articles/`
- Use frontmatter for metadata
- Import dynamically in the articles utility

**Option B: Headless CMS Integration**
Connect to services like:
- Contentful
- Sanity
- Strapi
- Ghost
- WordPress (headless)

Update the `articles.ts` utility to fetch from your CMS API instead of the local array.

## SEO Components

### SEO Component (`components/SEO.tsx`)

Handles all meta tags and structured data. Usage:

```tsx
<SEO
  title="Page Title"
  description="Page description"
  image="/path/to/image.jpg"
  type="article" // or "website"
  publishedTime="2025-01-18"
  author="Jack Roberts"
  tags={["tag1", "tag2"]}
  structuredData={{...}} // JSON-LD schema
/>
```

### Structured Data Types

**Organization Schema** (Homepage)
- Company information
- Logo
- Contact points
- Social media profiles

**WebSite Schema** (Homepage)
- Site name and URL
- Search functionality

**Article Schema** (Blog Posts)
- Headline, description, image
- Publication/modification dates
- Author information
- Publisher details

**BreadcrumbList Schema** (All Pages)
- Navigation context
- URL hierarchy

## Sitemap Management

### Current Setup
The sitemap is pre-generated at `/public/sitemap.xml`

### To Update the Sitemap

1. Run the sitemap generator:
```typescript
import { generateSitemap } from './utils/sitemap';
const xml = generateSitemap();
// Write to /public/sitemap.xml
```

2. Or download manually:
```typescript
import { downloadSitemap } from './utils/sitemap';
downloadSitemap(); // Downloads sitemap.xml file
```

### For Production
Set up automatic sitemap generation:
- On build (add to `package.json` build script)
- On deploy (CI/CD pipeline)
- Or use a serverless function for dynamic generation

## Robots.txt

Located at `/public/robots.txt`. Update the domain in the Sitemap line:

```
Sitemap: https://YOUR-DOMAIN.com/sitemap.xml
```

## URL Structure

- Homepage: `/`
- Blog Index: `/blog`
- Individual Articles: `/blog/[slug]`
- 404 handling: Automatically redirects invalid slugs

## Internal Linking

### Current Internal Links
- Footer → Blog page
- Blog cards → Article pages
- Article pages → Blog page (back button)
- Breadcrumbs on all blog pages

### To Add More Internal Links
1. Add a "Latest Articles" section to homepage
2. Link from service pages to relevant blog posts
3. Add related articles sections (already implemented)

## SEO Best Practices Checklist

### ✅ Implemented
- [x] Unique title tags for every page
- [x] Meta descriptions (150-160 chars)
- [x] Open Graph tags for social sharing
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] JSON-LD structured data
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Mobile-responsive design
- [x] Fast loading (Vite build)
- [x] Semantic HTML (article, header, footer)
- [x] Proper heading hierarchy (H1 > H2 > H3)
- [x] Image alt attributes
- [x] Internal linking structure
- [x] Breadcrumb navigation

### 📝 To Do
- [ ] Add actual domain to sitemap and SEO components
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics
- [ ] Create XML sitemap index (if you have multiple sitemaps)
- [ ] Add FAQ schema (if applicable)
- [ ] Implement pagination for blog (when >20 articles)
- [ ] Add social share buttons to articles
- [ ] Set up 301 redirects for old URLs (if migrating)
- [ ] Submit sitemap to search engines

## Testing Your SEO

### Local Testing
1. View page source (right-click → View Page Source)
2. Check `<head>` section for meta tags
3. Look for `<script type="application/ld+json">` for structured data

### Online Tools
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Schema Markup Validator**: https://validator.schema.org/

## Performance Optimization

### Current Setup
- React 19 (latest)
- Vite (fast build tool)
- Code splitting with React.lazy (if needed)
- Optimized images (use WebP format)

### Recommended
- Add image optimization (sharp, next/image alternative)
- Implement lazy loading for images
- Add service worker for caching
- Use CDN for static assets
- Minify CSS/JS (Vite does this automatically)

## Analytics Setup

### Google Analytics 4
Add to `/index.html` in `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property (domain or URL prefix)
3. Verify ownership (HTML tag or DNS)
4. Submit your sitemap URL

## Troubleshooting

### Articles not showing
- Check `published: true` in article data
- Verify slug matches URL
- Check browser console for errors

### SEO tags not updating
- Clear browser cache
- Hard refresh (Cmd/Ctrl + Shift + R)
- Check SEO component is imported

### Sitemap not accessible
- Ensure file is in `/public` folder
- Check build process includes public files
- Verify URL in robots.txt matches domain

## Next Steps

1. **Replace Sample Content**: Update the 3 sample articles in `articles.ts` with real content
2. **Add Your Domain**: Update all instances of `luminagrowth.com` with your actual domain
3. **Configure Analytics**: Add Google Analytics tracking
4. **Submit Sitemap**: Submit to Google Search Console and Bing Webmaster Tools
5. **Create More Content**: Aim for 10-20 articles for good SEO foundation
6. **Monitor Performance**: Track rankings, traffic, and engagement

## Support

For questions about this SEO setup:
1. Check this guide first
2. Review component comments in the code
3. Test with online SEO tools
4. Consult the official documentation for React Router and your chosen CMS

---

**Generated with Claude Code**
Last Updated: January 2025
