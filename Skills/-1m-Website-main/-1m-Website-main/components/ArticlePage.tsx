import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { getArticleBySlug, getRelatedArticles, formatDate, Article } from '../utils/articles';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (slug) {
      const foundArticle = getArticleBySlug(slug);
      if (foundArticle) {
        setArticle(foundArticle);
        setRelatedArticles(getRelatedArticles(slug));

        // Extract headings for table of contents
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = foundArticle.content;
        const headings = tempDiv.querySelectorAll('h2, h3');
        const toc: TableOfContentsItem[] = [];

        headings.forEach((heading, index) => {
          const text = heading.textContent || '';
          const id = `section-${index}`;
          const level = parseInt(heading.tagName[1]);
          toc.push({ id, text, level });
        });

        setTableOfContents(toc);
      } else {
        navigate('/404');
      }
    }
  }, [slug, navigate]);

  useEffect(() => {
    // Intersection Observer for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    document.querySelectorAll('h2[id], h3[id]').forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Scale With Teddy',
      logo: {
        '@type': 'ImageObject',
        url: '/Logo/1.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? window.location.href : ''
    }
  };

  // Convert markdown-style content to HTML with IDs for TOC
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    let html = '';
    let sectionIndex = 0;

    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        html += `<h1 class="text-4xl md:text-5xl font-bold text-white mb-6 mt-8">${line.slice(2)}</h1>`;
      } else if (line.startsWith('## ')) {
        html += `<h2 id="section-${sectionIndex}" class="text-2xl md:text-3xl font-bold text-white mb-4 mt-8">${line.slice(3)}</h2>`;
        sectionIndex++;
      } else if (line.startsWith('### ')) {
        html += `<h3 id="section-${sectionIndex}" class="text-xl md:text-2xl font-semibold text-white mb-3 mt-6">${line.slice(4)}</h3>`;
        sectionIndex++;
      } else if (line.trim()) {
        html += `<p class="text-gray-300 mb-4 leading-relaxed">${line}</p>`;
      }
    });

    return html;
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.description}
        image={article.image}
        type="article"
        publishedTime={article.date}
        author={article.author}
        tags={article.tags}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-black">
        {/* Breadcrumb Navigation */}
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-gray-600">/</span>
              <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-white">{article.title}</span>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            {/* Main Article Content */}
            <article className="max-w-3xl">
              {/* Article Header */}
              <header className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                    {article.category}
                  </span>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {article.title}
                </h1>

                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  {article.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold">
                        {article.author[0]}
                      </div>
                    </div>
                    <span className="text-white font-medium">{article.author}</span>
                  </div>
                  <span>•</span>
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </header>

              {/* Featured Image */}
              {article.image && (
                <div className="mb-12 rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Article Content */}
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
              />

              {/* Article Footer */}
              <footer className="mt-16 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Written by</p>
                    <p className="text-white font-medium">{article.author}</p>
                  </div>
                  <Link
                    to="/blog"
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  >
                    ← Back to Blog
                  </Link>
                </div>
              </footer>
            </article>

            {/* Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="glass-panel rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-bold mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors ${
                          activeSection === item.id
                            ? 'text-blue-400 font-medium'
                            : 'text-gray-400 hover:text-white'
                        } ${item.level === 3 ? 'pl-4' : ''}`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                  >
                    {related.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs text-blue-400 font-medium">
                        {related.category}
                      </span>
                      <h3 className="text-white font-bold mt-2 mb-2 group-hover:text-blue-400 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{related.description}</p>
                      <time className="text-xs text-gray-500">{formatDate(related.date)}</time>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
