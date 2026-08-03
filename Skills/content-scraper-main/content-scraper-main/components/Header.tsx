import React from 'react';
import { Button } from './ui/Button';
import { RefreshCw, Search, Bell } from 'lucide-react';
import { Tab } from '../types';

interface HeaderProps {
  onScrape: () => void;
  isScraping: boolean;
  activeTab: Tab;
}

export const Header: React.FC<HeaderProps> = ({ onScrape, isScraping, activeTab }) => {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="font-serif text-3xl font-medium text-text-main">
          {activeTab === 'feed' ? 'Content Feed' : 'Saved Items'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center bg-surface border border-border rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
          <Search className="w-4 h-4 text-text-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search content..." 
            className="bg-transparent border-none outline-none text-sm w-full text-text-main placeholder:text-text-muted"
          />
        </div>

        <button className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text-main hover:shadow-sm transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-secondary rounded-full border border-surface"></span>
        </button>

        <div className="h-8 w-px bg-border mx-1"></div>

        <Button 
          onClick={onScrape} 
          isLoading={isScraping}
          icon={<RefreshCw className="w-4 h-4" />}
          className="shadow-lg shadow-primary/20"
        >
          {isScraping ? 'Scraping...' : 'Scrape Now'}
        </Button>
      </div>
    </header>
  );
};