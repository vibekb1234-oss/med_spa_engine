import { ContentItem, SavedItem } from '../types';

// Mock data generator
const generateMockContent = (): ContentItem[] => [
  {
    id: `rd-${Date.now()}-1`,
    source: 'reddit',
    sourceName: 'r/Marketing',
    title: 'The shift from SEO to "Answer Engine Optimization"',
    previewText: 'With the rise of AI search, traditional SEO keywords are becoming less relevant. Here is how I restructured my agency to focus on answer optimization...',
    url: '#',
    timestamp: '2h ago',
  },
  {
    id: `nl-${Date.now()}-2`,
    source: 'newsletter',
    sourceName: 'Lenny\'s Newsletter',
    title: 'How to build a growth loop that actually works',
    previewText: 'Growth loops are the compound interest of product growth. In this issue, we break down the 3 types of loops used by Figma and Notion...',
    url: '#',
    timestamp: '4h ago',
  },
  {
    id: `rd-${Date.now()}-3`,
    source: 'reddit',
    sourceName: 'r/SaaS',
    title: 'Roast my landing page: Converting at 0.5%',
    previewText: 'I launched last week and traffic is decent but nobody is signing up. I suspect my value prop is unclear. Can you guys take a look?',
    url: '#',
    timestamp: '5h ago',
  },
  {
    id: `nl-${Date.now()}-4`,
    source: 'newsletter',
    sourceName: 'The Hustle',
    title: 'The economics of vending machines in 2024',
    previewText: 'Is the passive income dream of vending machines still alive? We analyzed data from 500 operators to find the real margins.',
    url: '#',
    timestamp: '6h ago',
  },
  {
    id: `rd-${Date.now()}-5`,
    source: 'reddit',
    sourceName: 'r/copywriting',
    title: '3 psychological triggers missing from your ads',
    previewText: 'Most copywriters focus on benefits but forget the emotional triggers that actually cause the click. Here are the big three...',
    url: '#',
    timestamp: '8h ago',
  },
];

export const api = {
  // Simulate N8N webhook scrape
  scrapeContent: async (): Promise<ContentItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockContent());
      }, 2000);
    });
  },

  // Simulate generating a hook via N8N
  generateHook: async (itemTitle: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hooks = [
          `🔥 ${itemTitle} (And why you're ignoring it)`,
          `Stop doing this if you want to succeed at ${itemTitle.split(' ').slice(0, 3).join(' ')}...`,
          `I analyzed 100 examples of ${itemTitle.split(' ').slice(0, 2).join(' ')} and found this pattern 🧵`,
          `Unpopular opinion: ${itemTitle} is the future. Here's why.`,
        ];
        resolve(hooks[Math.floor(Math.random() * hooks.length)]);
      }, 2500);
    });
  },
};