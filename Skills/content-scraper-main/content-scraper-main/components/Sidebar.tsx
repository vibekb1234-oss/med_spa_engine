import React from 'react';
import { Tab } from '../types';
import { LayoutGrid, Bookmark, Settings, HelpCircle, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, savedCount }) => {
  const NavItem = ({ tab, icon: Icon, label, badge }: { tab: Tab, icon: any, label: string, badge?: number }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => onTabChange(tab)}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive 
            ? "bg-primary text-white shadow-lg shadow-primary/20" 
            : "text-text-muted hover:bg-black/5 hover:text-text-main"
        )}
      >
        <Icon className={clsx("w-5 h-5", isActive ? "stroke-[2px]" : "stroke-[1.5px]")} />
        <span>{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className={clsx(
            "ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
            isActive ? "bg-white/20 text-white" : "bg-border text-text-main"
          )}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-surface border-r border-border hidden md:flex flex-col p-6 shadow-sm z-20">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-serif font-bold text-xl">
          C
        </div>
        <span className="font-serif text-xl font-bold tracking-tight text-text-main">
          Content<span className="text-primary">Intel</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="px-4 text-xs font-bold text-text-muted/50 tracking-wider mb-2">MENU</p>
        <NavItem tab="feed" icon={LayoutGrid} label="Feed" />
        <NavItem tab="saved" icon={Bookmark} label="Saved" badge={savedCount} />
      </nav>

      <div className="space-y-1 pt-6 border-t border-border/50">
        <p className="px-4 text-xs font-bold text-text-muted/50 tracking-wider mb-2">GENERAL</p>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:bg-black/5 hover:text-text-main transition-colors">
          <Settings className="w-5 h-5 stroke-[1.5px]" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:bg-black/5 hover:text-text-main transition-colors">
          <HelpCircle className="w-5 h-5 stroke-[1.5px]" />
          <span>Help</span>
        </button>
      </div>

      <div className="pt-6 mt-6 border-t border-border/50 flex items-center gap-3 px-2">
        <img 
          src="https://picsum.photos/100/100" 
          alt="User" 
          className="w-9 h-9 rounded-full border border-border"
        />
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-text-main truncate">Alex Editor</p>
          <p className="text-xs text-text-muted truncate">alex@studio.co</p>
        </div>
      </div>
    </aside>
  );
};