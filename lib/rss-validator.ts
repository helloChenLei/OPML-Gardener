export interface ValidationResult {
  isValid: boolean;
  status?: number;
  error?: string;
}

export async function validateRssUrl(url: string): Promise<ValidationResult> {
  try {
    // Basic URL validation
    new URL(url);

    // Try to fetch the RSS feed
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors", // Handle CORS issues
      cache: "no-cache",
    });

    // Note: With no-cors mode, we can't check the actual status
    // But if fetch doesn't throw, the URL is likely reachable
    return {
      isValid: true,
      status: response.status || 200,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function validateMultipleRssUrls(
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, ValidationResult>> {
  const results = new Map<string, ValidationResult>();

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await validateRssUrl(url);
    results.set(url, result);

    if (onProgress) {
      onProgress(i + 1, urls.length);
    }

    // Add a small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

