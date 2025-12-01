import { FeedItem, OpmlOutlineData } from "@/types";

/**
 * JSON 序列化的 Feed 数据（日期转为字符串）
 */
export interface SerializedFeedItem {
  id: string;
  title: string;
  xmlUrl: string;
  htmlUrl?: string;
  category: string;
  isValid?: boolean;
  lastChecked?: string;
  lastUpdated?: string;
  originalData?: OpmlOutlineData;
  isSelected: boolean;
}

export interface JsonExportData {
  version: string;
  exportDate: string;
  feeds: FeedItem[];
}

export function exportToJson(feeds: FeedItem[]): string {
  const serializedFeeds: SerializedFeedItem[] = feeds.map((feed) => ({
    ...feed,
    lastChecked: feed.lastChecked?.toISOString(),
    lastUpdated: feed.lastUpdated?.toISOString(),
  }));

  const data: JsonExportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    feeds: serializedFeeds,
  };

  return JSON.stringify(data, null, 2);
}

export function parseJson(jsonContent: string): FeedItem[] {
  try {
    const data = JSON.parse(jsonContent) as JsonExportData;

    if (!data.feeds || !Array.isArray(data.feeds)) {
      throw new Error("Invalid JSON format: missing feeds array");
    }

    return data.feeds.map((serializedFeed: SerializedFeedItem): FeedItem => ({
      ...serializedFeed,
      lastChecked: serializedFeed.lastChecked ? new Date(serializedFeed.lastChecked) : undefined,
      lastUpdated: serializedFeed.lastUpdated ? new Date(serializedFeed.lastUpdated) : undefined,
      isSelected: false, // Reset selection state
    }));
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

