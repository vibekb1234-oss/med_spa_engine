import React from 'react';
import { SavedItem } from '../types';
import { Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SavedItemCardProps {
  item: SavedItem;
  onGenerateHook: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const SavedItemCard: React.FC<SavedItemCardProps> = ({ item, onGenerateHook, onDelete, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (item.generatedHook) {
      navigator.clipboard.writeText(item.generatedHook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface rounded-xl p-6 border border-border shadow-warm mb-4"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{item.sourceName}</span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="text-xs text-text-muted">Saved {new Date().toLocaleDateString()}</span>
          </div>
          
          <h3 className="font-serif text-lg font-semibold text-text-main mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-4">
            {item.previewText}
          </p>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8 px-3"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Remove
            </Button>
          </div>
        </div>

        {/* Hook Generation Area */}
        <div className="md:w-[45%] flex flex-col justify-center">
          <div className="bg-background rounded-lg p-5 border border-border/60 h-full flex flex-col justify-center relative overflow-hidden group">
            
            <AnimatePresence mode="wait">
              {item.generatedHook ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Generated Hook
                    </span>
                    <button 
                      onClick={handleCopy}
                      className="text-text-muted hover:text-primary transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="font-serif text-lg leading-snug text-text-main">
                    "{item.generatedHook}"
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center py-2"
                >
                  <p className="text-sm text-text-muted mb-4 max-w-[200px]">
                    Transform this content into a viral hook with AI.
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => onGenerateHook(item.id, item.title)}
                    isLoading={item.isGeneratingHook}
                    icon={<Sparkles className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Generate Hook
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};