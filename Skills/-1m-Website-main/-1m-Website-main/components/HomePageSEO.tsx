import React from 'react';
import SEO from './SEO';

const HomePageSEO: React.FC = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Scale With Teddy',
    description: 'Helping expert consultants and agencies scale past $50k/mo with data-driven LinkedIn systems.',
    url: 'https://scalewithteddy.com',
    logo: 'https://scalewithteddy.com/Logo/1.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales'
    },
    sameAs: [
      'https://www.linkedin.com/company/scalewithteddy',
      'https://twitter.com/scalewithteddy'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Scale With Teddy',
    url: 'https://scalewithteddy.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://scalewithteddy.com/blog?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://scalewithteddy.com'
      }
    ]
  };

  // Combine all schemas
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema, breadcrumbSchema]
  };

  return (
    <SEO
      title="Scale Your Business with LinkedIn"
      description="Ready to get 5 clients from LinkedIn in 30 days? If you're making $50k/mo+ online and want a hands-off LinkedIn revenue stream, we'll show you exactly how much profit you're leaving on the table."
      structuredData={structuredData}
    />
  );
};

export default HomePageSEO;
