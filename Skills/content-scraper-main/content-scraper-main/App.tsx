import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ContentCard } from './components/ContentCard';
import { SavedItemCard } from './components/SavedItemCard';
import { ContentItem, SavedItem, Tab } from './types';
import { api } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initial load
  useEffect(() => {
    // Simulate initial data fetch
    const loadInitialData = async () => {
      // Small artificial delay for nice entry animation
      await new Promise(r => setTimeout(r, 800));
      setIsInitialLoad(false);
    };
    loadInitialData();
  }, []);

  const handleScrape = async () => {
    setIsScraping(true);
    try {
      const newItems = await api.scrapeContent();
      
      // Merge with existing, filtering duplicates if real IDs existed (mock uses unique IDs mostly)
      setItems(prev => [...newItems, ...prev]);
      
      toast.success(`Found ${newItems.length} new content items`, {
        style: {
          background: '#1A1A1A',
          color: '#fff',
          fontFamily: '"DM Sans", sans-serif',
        },
        iconTheme: {
          primary: '#0D6E6E',
          secondary: '#fff',
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to scrape content. Check console for details.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleSaveItem = (item: ContentItem) => {
    if (savedItems.some(s => s.id === item.id)) return;

    const newItem: SavedItem = {
      ...item,
      savedAt: new Date().toISOString(),
      isSaved: true
    };

    setSavedItems(prev => [newItem, ...prev]);
    
    // Update feed item state
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isSaved: true } : i));

    toast.success('Saved to collection', { position: 'bottom-right' });
  };

  const handleDeleteSaved = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
    setItems(prev => prev.map(i => i.id === id ? { ...i, isSaved: false } : i));
    toast('Removed from saved', { icon: '🗑️', position: 'bottom-right' });
  };

  const handleGenerateHook = async (id: string, title: string) => {
    setSavedItems(prev => prev.map(i => i.id === id ? { ...i, isGeneratingHook: true } : i));
    
    try {
      const hook = await api.generateHook(title);
      setSavedItems(prev => prev.map(i => i.id === id ? { 
        ...i, 
        isGeneratingHook: false, 
        generatedHook: hook 
      } : i));
      toast.success('Hook generated successfully!', { position: 'bottom-right' });
    } catch (error) {
      setSavedItems(prev => prev.map(i => i.id === id ? { ...i, isGeneratingHook: false } : i));
      toast.error('Failed to generate hook');
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-text-main">
      <Toaster />
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        savedCount={savedItems.length}
      />
      
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <Header 
          onScrape={handleScrape} 
          isScraping={isScraping} 
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto">
            
            {/* Initial Loading State */}
            {isInitialLoad && items.length === 0 && !isScraping && (
               <div className="flex flex-col items-center justify-center h-[60vh] opacity-50">
                  <p className="font-serif text-xl text-text-muted">Initializing dashboard...</p>
               </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'feed' ? (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {items.length === 0 && !isInitialLoad ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center max-w-md mx-auto">
                      <div className="w-16 h-16 bg-border/30 rounded-full flex items-center justify-center mb-6">
                        <Loader2 className="w-8 h-8 text-text-muted opacity-50" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold mb-3">No content yet</h2>
                      <p className="text-text-muted mb-8 leading-relaxed">
                        Your feed is empty. Hit the scrape button to fetch the latest insights from your sources.
                      </p>
                      <button 
                        onClick={handleScrape}
                        className="text-primary font-medium hover:underline underline-offset-4"
                      >
                        Start Scraping &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-20">
                      {items.map((item, idx) => (
                        <div key={item.id} className="break-inside-avoid">
                          <ContentCard 
                            item={item} 
                            index={idx}
                            onSave={handleSaveItem} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {savedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                      <h2 className="font-serif text-2xl font-bold mb-3">Nothing saved yet</h2>
                      <p className="text-text-muted max-w-md mx-auto mb-6">
                        Star items from your feed to save them here and unlock powerful AI tools.
                      </p>
                      <button 
                        onClick={() => setActiveTab('feed')}
                        className="text-primary font-medium hover:underline underline-offset-4"
                      >
                        Return to Feed &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto space-y-6 pb-20">
                      {savedItems.map((item, idx) => (
                        <SavedItemCard 
                          key={item.id} 
                          item={item} 
                          index={idx}
                          onGenerateHook={handleGenerateHook}
                          onDelete={handleDeleteSaved}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;