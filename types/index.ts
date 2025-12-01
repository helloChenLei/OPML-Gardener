export type FeedItem = {
  id: string;          // UUID
  title: string;       // Mapped from opml 'text' or 'title'
  xmlUrl: string;      // The RSS feed URL
  htmlUrl?: string;    // The website URL
  category: string;    // The parent folder name (e.g., "Articles")
  isValid?: boolean;   // RSS link validation status
  lastChecked?: Date;  // Last validation check time
  lastUpdated?: Date;  // Last RSS feed update time (from feed itself)
  originalData?: any;  // Keep other attributes just in case
  isSelected: boolean; // For UI state
};

export type CategoryGroup = {
  name: string;
  feeds: FeedItem[];
};

export type OpmlStats = {
  totalFeeds: number;
  selectedFeeds: number;
  categories: string[];
  validFeeds?: number;
  invalidFeeds?: number;
  uncheckedFeeds?: number;
};

