export type SourceType = 'reddit' | 'newsletter';

export interface ContentItem {
  id: string;
  source: SourceType;
  sourceName: string;
  title: string;
  previewText: string;
  url: string;
  timestamp: string;
  isSaved?: boolean;
}

export interface SavedItem extends ContentItem {
  savedAt: string;
  generatedHook?: string;
  isGeneratingHook?: boolean;
}

export type Tab = 'feed' | 'saved';

export interface AppState {
  items: ContentItem[];
  savedItems: SavedItem[];
  isLoading: boolean;
  activeTab: Tab;
}