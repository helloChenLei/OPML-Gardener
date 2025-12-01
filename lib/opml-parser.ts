import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { FeedItem, OpmlOutlineData } from "@/types";
import { generateId } from "./utils";

/**
 * Parse OPML file content and extract feeds with their categories
 * 
 * Expected OPML structure:
 * <opml>
 *   <body>
 *     <outline text="Articles">
 *       <outline text="Blog Title" xmlUrl="..." htmlUrl="..." />
 *     </outline>
 *     <outline text="Videos">
 *       <outline text="YouTube Channel" xmlUrl="..." />
 *     </outline>
 *   </body>
 * </opml>
 */
export function parseOpml(xmlContent: string): FeedItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true,
  });

  const result = parser.parse(xmlContent);
  const feeds: FeedItem[] = [];

  // Navigate to body > outline
  const body = result?.opml?.body;
  if (!body) {
    throw new Error("Invalid OPML structure: missing body element");
  }

  let outlines = body.outline;
  if (!outlines) {
    return feeds;
  }

  // Ensure outlines is an array
  if (!Array.isArray(outlines)) {
    outlines = [outlines];
  }

  // Process each top-level outline (category)
  outlines.forEach((categoryOutline: OpmlOutlineData) => {
    const categoryName = categoryOutline.text || "Uncategorized";
    
    // Check if this outline has children (nested feeds)
    let childOutlines = categoryOutline.outline;
    
    if (!childOutlines) {
      // This is a feed without a category (treat as its own category)
      if (categoryOutline.xmlUrl) {
        feeds.push({
          id: generateId(),
          title: categoryOutline.title || categoryOutline.text || "Untitled",
          xmlUrl: categoryOutline.xmlUrl,
          htmlUrl: categoryOutline.htmlUrl,
          category: "Uncategorized",
          originalData: categoryOutline,
          isSelected: false,
        });
      }
      return;
    }

    // Ensure childOutlines is an array
    if (!Array.isArray(childOutlines)) {
      childOutlines = [childOutlines];
    }

    // Process each feed within the category
    childOutlines.forEach((feedOutline: OpmlOutlineData) => {
      if (feedOutline.xmlUrl) {
        feeds.push({
          id: generateId(),
          title: feedOutline.title || feedOutline.text || "Untitled",
          xmlUrl: feedOutline.xmlUrl,
          htmlUrl: feedOutline.htmlUrl,
          category: categoryName,
          originalData: feedOutline,
          isSelected: false,
        });
      } else if (feedOutline.outline) {
        // Handle deeper nesting (recursively flatten)
        let deepOutlines = feedOutline.outline;
        if (!Array.isArray(deepOutlines)) {
          deepOutlines = [deepOutlines];
        }
        deepOutlines.forEach((deepFeed: OpmlOutlineData) => {
          if (deepFeed.xmlUrl) {
            feeds.push({
              id: generateId(),
              title: deepFeed.title || deepFeed.text || "Untitled",
              xmlUrl: deepFeed.xmlUrl,
              htmlUrl: deepFeed.htmlUrl,
              category: categoryName,
              originalData: deepFeed,
              isSelected: false,
            });
          }
        });
      }
    });
  });

  return feeds;
}

/**
 * Export feeds back to OPML format
 * Groups feeds by category and creates nested structure
 * 
 * 安全注意事项：
 * - fast-xml-parser (v4.x) 的 XMLBuilder 会自动转义 XML 实体字符
 * - 包括: & → &amp;, < → &lt;, > → &gt;, " → &quot;, ' → &apos;
 * - 无需手动转义，XMLBuilder 会确保输出的 XML 符合 XML 1.0 规范
 * - 参考: lib/xml-escape.ts 提供了备用的手动转义工具（仅在需要时使用）
 */
export function exportOpml(feeds: FeedItem[], filename = "filtered_feeds.opml"): string {
  // Group feeds by category
  const categoryMap = new Map<string, FeedItem[]>();
  
  feeds.forEach((feed) => {
    const category = feed.category || "Uncategorized";
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(feed);
  });

  // Build OPML structure
  const categoryOutlines = Array.from(categoryMap.entries()).map(
    ([categoryName, categoryFeeds]) => ({
      text: categoryName,
      outline: categoryFeeds.map((feed) => ({
        text: feed.title,
        title: feed.title,
        type: "rss",
        xmlUrl: feed.xmlUrl,
        htmlUrl: feed.htmlUrl || "",
      })),
    })
  );

  const opmlStructure = {
    "?xml": {
      version: "1.0",
      encoding: "UTF-8",
    },
    opml: {
      version: "2.0",
      head: {
        title: "OPML Gardener Export",
        dateCreated: new Date().toUTCString(),
      },
      body: {
        outline: categoryOutlines,
      },
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    format: true,
    suppressEmptyNode: true,
  });

  return builder.build(opmlStructure);
}

/**
 * Trigger download of OPML file
 */
export function downloadOpml(content: string, filename = "filtered_feeds.opml"): void {
  const blob = new Blob([content], { type: "text/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

