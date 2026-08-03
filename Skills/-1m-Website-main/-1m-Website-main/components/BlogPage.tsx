import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import { getAllArticles, getAllCategories, getAllTags, formatDate, Article } from '../utils/articles';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const categories = getAllCategories();
  const tags = getAllTags();

  useEffect(() => {
    const allArticles = getAllArticles();
    setArticles(allArticles);
    setFilteredArticles(allArticles);
  }, []);

  useEffect(() => {
    let filtered = articles;

    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(article => article.tags.includes(selectedTag));
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, selectedTag, searchQuery, articles]);

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Scale With Teddy Blog',
    description: 'Expert insights on LinkedIn growth, B2B lead generation, and scaling your consulting business.',
    url: typeof window !== 'undefined' ? window.location.href : '',
    publisher: {
      '@type': 'Organization',
      name: 'Scale With Teddy',
      logo: {
        '@type': 'ImageObject',
        url: '/Logo/1.png'
      }
    },
    blogPost: filteredArticles.map(article => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      image: article.image,
      datePublished: article.date,
      author: {
        '@type': 'Person',
        name: article.author
      }
    }))
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Expert insights on LinkedIn growth, B2B lead generation, and scaling your consulting business past $50k/month."
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
              <span className="text-white">Blog</span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Strategies</span>
              </h1>
              <p className="text-xl text-gray-400">
                Expert insights on LinkedIn growth, B2B lead generation, and scaling your consulting business past $50k/month.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              <button
                onClick={() => { setSelectedCategory(null); setSelectedTag(null); }}
                className={`px-6 py-2 rounded-full transition-all ${
                  !selectedCategory && !selectedTag
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                } border`}
              >
                All Articles
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setSelectedTag(null); }}
                  className={`px-6 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  } border`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-500/5 blur-[100px] pointer-events-none" />
        </section>

        {/* Articles Grid */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No articles found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {featuredArticle && (
                  <Link
                    to={`/blog/${featuredArticle.slug}`}
                    className="block mb-12 glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                            {featuredArticle.category}
                          </span>
                          <span className="text-gray-500 text-sm">Featured</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                          {featuredArticle.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="text-white font-medium">{featuredArticle.author}</span>
                          <span>•</span>
                          <time>{formatDate(featuredArticle.date)}</time>
                        </div>
                      </div>
                      {featuredArticle.image && (
                        <div className="aspect-video md:aspect-auto overflow-hidden">
                          <img
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                )}

                {/* Article Grid */}
                {otherArticles.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherArticles.map((article) => (
                      <Link
                        key={article.slug}
                        to={`/blog/${article.slug}`}
                        className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group flex flex-col"
                      >
                        {article.image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <span className="text-xs text-blue-400 font-medium mb-3">
                            {article.category}
                          </span>
                          <h3 className="text-white font-bold text-xl mb-2 group-hover:text-blue-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 flex-1">
                            {article.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="text-white font-medium">{article.author}</span>
                            <span>•</span>
                            <time>{formatDate(article.date)}</time>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Tags Section */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="glass-panel rounded-2xl p-8 border border-white/10">
              <h3 className="text-white font-bold text-xl mb-4">Explore by Topic</h3>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setSelectedTag(tag); setSelectedCategory(null); }}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedTag === tag
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    } border`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;
