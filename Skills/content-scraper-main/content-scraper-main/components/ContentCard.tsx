import React from 'react';
import { ContentItem } from '../types';
import { Bookmark, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface ContentCardProps {
  item: ContentItem;
  onSave: (item: ContentItem) => void;
  index: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, onSave, index }) => {
  const isReddit = item.source === 'reddit';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative bg-surface rounded-xl p-6 border border-border/50 shadow-warm hover:shadow-warm-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={clsx(
          "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full",
          isReddit ? "bg-[#FF4500]/10 text-[#FF4500]" : "bg-primary/10 text-primary"
        )}>
          {item.sourceName}
        </span>
        <span className="text-xs text-text-muted font-sans">{item.timestamp}</span>
      </div>

      <h3 className="font-serif text-xl font-semibold leading-tight mb-3 text-text-main group-hover:text-primary transition-colors">
        {item.title}
      </h3>
      
      <p className="text-text-muted text-sm leading-relaxed line-clamp-3 mb-6 font-sans">
        {item.previewText}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <button 
          onClick={() => onSave(item)}
          disabled={item.isSaved}
          className={clsx(
            "flex items-center gap-2 text-sm font-medium transition-colors",
            item.isSaved ? "text-primary cursor-default" : "text-text-muted hover:text-primary"
          )}
        >
          <Bookmark className={clsx("w-4 h-4", item.isSaved && "fill-current")} />
          {item.isSaved ? "Saved" : "Save Item"}
        </button>

        <a 
          href={item.url} 
          className="text-text-muted hover:text-text-main transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};