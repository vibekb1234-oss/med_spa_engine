import { getAllArticles } from './articles';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://scalewithteddy.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    }
  ];

  // Add all article pages
  const articles = getAllArticles();
  articles.forEach(article => {
    urls.push({
      loc: `${baseUrl}/blog/${article.slug}`,
      lastmod: article.date,
      changefreq: 'monthly',
      priority: '0.8'
    });
  });

  // Generate XML
  const urlsXml = urls
    .map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
};

// Function to download sitemap (for development)
export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
