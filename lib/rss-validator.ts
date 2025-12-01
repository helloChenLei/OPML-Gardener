export interface ValidationResult {
  isValid: boolean;
  status?: number;
  error?: string;
  lastUpdated?: Date;
}

export async function validateRssUrl(url: string): Promise<ValidationResult> {
  try {
    // Basic URL validation
    const urlObj = new URL(url);
    
    // Only support http and https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return {
        isValid: false,
        error: "Invalid URL protocol",
      };
    }

    // Try to fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // Use GET to fetch feed content and parse last update date
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'OPML-Gardener/1.0',
        },
      });

      clearTimeout(timeoutId);

      // Consider 2xx and 3xx as valid
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        let lastUpdated: Date | undefined;
        
        try {
          const text = await response.text();
          // Parse RSS/Atom feed for last update date
          const lastBuildDateMatch = text.match(/<lastBuildDate>(.*?)<\/lastBuildDate>/i);
          const pubDateMatch = text.match(/<pubDate>(.*?)<\/pubDate>/i);
          const updatedMatch = text.match(/<updated>(.*?)<\/updated>/i);
          const dcDateMatch = text.match(/<dc:date>(.*?)<\/dc:date>/i);
          
          const dateStr = lastBuildDateMatch?.[1] || pubDateMatch?.[1] || updatedMatch?.[1] || dcDateMatch?.[1];
          if (dateStr) {
            const parsedDate = new Date(dateStr);
            if (!isNaN(parsedDate.getTime())) {
              lastUpdated = parsedDate;
            }
          }
        } catch (parseError) {
          // If parsing fails, just ignore the last updated date
          console.warn('Failed to parse feed date:', parseError);
        }
        
        return {
          isValid: true,
          status: response.status,
          lastUpdated,
        };
      }

      return {
        isValid: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // If it's a CORS error or network error, try GET request as fallback
      if (fetchError.name === 'TypeError' || fetchError.message.includes('CORS')) {
        try {
          // Some servers don't support HEAD, try a lightweight GET
          const getResponse = await fetch(url, {
            method: 'GET',
            mode: 'no-cors', // This won't give us status, but confirms reachability
          });
          
          // With no-cors mode, if fetch succeeds, we assume it's valid
          return {
            isValid: true,
            status: 200,
          };
        } catch {
          // If both fail, mark as invalid
          return {
            isValid: false,
            error: "Cannot reach URL (CORS/Network)",
          };
        }
      }

      if (fetchError.name === 'AbortError') {
        return {
          isValid: false,
          error: "Timeout (>5s)",
        };
      }

      return {
        isValid: false,
        error: fetchError.message || "Network error",
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Validate URLs with concurrency limit to avoid overwhelming the browser
async function validateWithConcurrency(
  urls: string[],
  concurrency: number,
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, ValidationResult>> {
  const results = new Map<string, ValidationResult>();
  let completed = 0;

  // Process in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchPromises = batch.map(async (url) => {
      const result = await validateRssUrl(url);
      results.set(url, result);
      completed++;
      if (onProgress) {
        onProgress(completed, urls.length);
      }
      return { url, result };
    });

    await Promise.all(batchPromises);
  }

  return results;
}

export async function validateMultipleRssUrls(
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, ValidationResult>> {
  // Validate with concurrency limit of 10
  return validateWithConcurrency(urls, 10, onProgress);
}

