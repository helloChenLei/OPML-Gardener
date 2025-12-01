/**
 * RSS Feed Health Checker
 * Uses CORS proxy to fetch feed data and extract last update time
 */

const CORS_PROXY = "https://api.allorigins.win/get?url=";

export interface FeedHealthResult {
  success: boolean;
  lastUpdated: string | null; // YYYY-MM-DD format
  error?: string;
}

/**
 * Check feed health and extract last updated date
 */
export async function checkFeedHealth(feedUrl: string): Promise<FeedHealthResult> {
  try {
    // Use CORS proxy to fetch the feed
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        lastUpdated: null,
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const xmlContent = data.contents;

    if (!xmlContent) {
      return {
        success: false,
        lastUpdated: null,
        error: '无法获取内容',
      };
    }

    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

    // Check for parser errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      return {
        success: false,
        lastUpdated: null,
        error: '解析错误',
      };
    }

    // Extract date from different feed formats
    const dateString = extractDateFromFeed(xmlDoc);
    
    if (!dateString) {
      return {
        success: false,
        lastUpdated: null,
        error: '未找到日期',
      };
    }

    // Format to YYYY-MM-DD
    const formattedDate = formatDate(dateString);

    return {
      success: true,
      lastUpdated: formattedDate,
    };
  } catch (error) {
    return {
      success: false,
      lastUpdated: null,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * Extract date from RSS/Atom feed XML
 */
function extractDateFromFeed(xmlDoc: Document): string | null {
  // Try RSS 2.0 <lastBuildDate>
  let dateElement = xmlDoc.querySelector('channel > lastBuildDate');
  if (dateElement?.textContent) {
    return dateElement.textContent;
  }

  // Try RSS 2.0 <pubDate> (first item)
  dateElement = xmlDoc.querySelector('channel > item > pubDate');
  if (dateElement?.textContent) {
    return dateElement.textContent;
  }

  // Try Atom <updated> (feed level)
  dateElement = xmlDoc.querySelector('feed > updated');
  if (dateElement?.textContent) {
    return dateElement.textContent;
  }

  // Try Atom <updated> (first entry)
  dateElement = xmlDoc.querySelector('feed > entry > updated');
  if (dateElement?.textContent) {
    return dateElement.textContent;
  }

  // Try Atom <published> (first entry)
  dateElement = xmlDoc.querySelector('feed > entry > published');
  if (dateElement?.textContent) {
    return dateElement.textContent;
  }

  return null;
}

/**
 * Format date string to YYYY-MM-DD
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
}

/**
 * Batch process feeds with concurrency limit
 */
export async function batchCheckFeeds(
  feedUrls: string[],
  concurrencyLimit: number = 5,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, FeedHealthResult>> {
  const results = new Map<string, FeedHealthResult>();
  const total = feedUrls.length;
  let completed = 0;

  // Process in chunks
  for (let i = 0; i < feedUrls.length; i += concurrencyLimit) {
    const chunk = feedUrls.slice(i, i + concurrencyLimit);
    
    // Process chunk in parallel
    const chunkResults = await Promise.all(
      chunk.map(async (url) => {
        const result = await checkFeedHealth(url);
        return { url, result };
      })
    );

    // Store results
    chunkResults.forEach(({ url, result }) => {
      results.set(url, result);
      completed++;
      onProgress?.(completed, total);
    });
  }

  return results;
}

