import { FeedItem } from "@/types";

export interface JsonExportData {
  version: string;
  exportDate: string;
  feeds: FeedItem[];
}

export function exportToJson(feeds: FeedItem[]): string {
  const data: JsonExportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    feeds: feeds.map((feed) => {
      const { lastChecked, lastUpdated, ...rest } = feed;
      return {
        ...rest,
        lastChecked: lastChecked?.toISOString() as any,
        lastUpdated: lastUpdated?.toISOString() as any,
      };
    }),
  };

  return JSON.stringify(data, null, 2);
}

export function parseJson(jsonContent: string): FeedItem[] {
  try {
    const data = JSON.parse(jsonContent) as JsonExportData;

    if (!data.feeds || !Array.isArray(data.feeds)) {
      throw new Error("Invalid JSON format: missing feeds array");
    }

    return data.feeds.map((feed: any) => ({
      ...feed,
      lastChecked: feed.lastChecked ? new Date(feed.lastChecked) : undefined,
      lastUpdated: feed.lastUpdated ? new Date(feed.lastUpdated) : undefined,
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

