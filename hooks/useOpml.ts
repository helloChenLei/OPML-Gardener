"use client";

import { useState, useMemo } from "react";
import { FeedItem, OpmlStats } from "@/types";
import { parseOpml, exportOpml, downloadOpml } from "@/lib/opml-parser";
import { parseJson, exportToJson, downloadJson } from "@/lib/json-handler";
import { useHistory } from "./useHistory";
import { validateMultipleRssUrls } from "@/lib/rss-validator";

export function useOpml() {
  const { 
    state: feeds, 
    setState: setFeeds, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    reset: resetHistory
  } = useHistory<FeedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"title" | "category" | "date">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Import OPML file
  const importOpml = (fileContent: string) => {
    try {
      const parsedFeeds = parseOpml(fileContent);
      resetHistory(parsedFeeds);
      return { success: true, count: parsedFeeds.length };
    } catch (error) {
      console.error("Failed to parse OPML:", error);
      return { success: false, error: String(error) };
    }
  };

  // Import JSON file
  const importJson = (fileContent: string) => {
    try {
      const parsedFeeds = parseJson(fileContent);
      resetHistory(parsedFeeds);
      return { success: true, count: parsedFeeds.length };
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return { success: false, error: String(error) };
    }
  };

  // Export selected or all feeds as OPML
  const exportFeeds = (selectedOnly = false) => {
    const feedsToExport = selectedOnly
      ? feeds.filter((f) => f.isSelected)
      : feeds;
    
    if (feedsToExport.length === 0) {
      return { success: false, error: "No feeds to export" };
    }

    try {
      const opmlContent = exportOpml(feedsToExport);
      downloadOpml(opmlContent, "opml_gardener_export.opml");
      return { success: true, count: feedsToExport.length };
    } catch (error) {
      console.error("Failed to export OPML:", error);
      return { success: false, error: String(error) };
    }
  };

  // Export selected or all feeds as JSON
  const exportFeedsAsJson = (selectedOnly = false) => {
    const feedsToExport = selectedOnly
      ? feeds.filter((f) => f.isSelected)
      : feeds;
    
    if (feedsToExport.length === 0) {
      return { success: false, error: "No feeds to export" };
    }

    try {
      const jsonContent = exportToJson(feedsToExport);
      downloadJson(jsonContent, "opml_gardener_export.json");
      return { success: true, count: feedsToExport.length };
    } catch (error) {
      console.error("Failed to export JSON:", error);
      return { success: false, error: String(error) };
    }
  };

  // Update a single feed
  const updateFeed = (id: string, updates: Partial<FeedItem>) => {
    setFeeds((prev) =>
      prev.map((feed) => (feed.id === id ? { ...feed, ...updates } : feed))
    );
  };

  // Delete a feed
  const deleteFeed = (id: string) => {
    setFeeds((prev) => prev.filter((feed) => feed.id !== id));
  };

  // Toggle feed selection
  const toggleFeedSelection = (id: string) => {
    setFeeds((prev) =>
      prev.map((feed) =>
        feed.id === id ? { ...feed, isSelected: !feed.isSelected } : feed
      )
    );
  };

  // Select/deselect all feeds
  const toggleAllSelection = (selected: boolean) => {
    setFeeds((prev) => prev.map((feed) => ({ ...feed, isSelected: selected })));
  };

  // Bulk update category
  const bulkUpdateCategory = (feedIds: string[], newCategory: string) => {
    setFeeds((prev) =>
      prev.map((feed) =>
        feedIds.includes(feed.id) ? { ...feed, category: newCategory } : feed
      )
    );
  };

  // Remove duplicates based on xmlUrl
  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueFeeds = feeds.filter((feed) => {
      if (seen.has(feed.xmlUrl)) {
        return false;
      }
      seen.add(feed.xmlUrl);
      return true;
    });
    setFeeds(uniqueFeeds);
    return feeds.length - uniqueFeeds.length;
  };

  // Add a new empty category (will appear when a feed is assigned to it)
  const addCategory = (categoryName: string) => {
    // The category will automatically appear when a feed is assigned to it
    // For now, we just return success
    return { success: true };
  };

  // Validate RSS URLs
  const validateRssFeeds = async (
    onProgress?: (current: number, total: number) => void
  ) => {
    const urls = feeds.map((f) => f.xmlUrl);
    const results = await validateMultipleRssUrls(urls, onProgress);

    // Update feeds with validation results
    const updatedFeeds = feeds.map((feed) => {
      const result = results.get(feed.xmlUrl);
      return {
        ...feed,
        isValid: result?.isValid ?? undefined,
        lastChecked: new Date(),
      };
    });

    setFeeds(updatedFeeds);
    return results;
  };

  // Filtered feeds based on search and category
  const filteredFeeds = useMemo(() => {
    let result = feeds.filter((feed) => {
      const matchesSearch =
        searchQuery === "" ||
        feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.xmlUrl.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || feed.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "date":
          const dateA = a.lastChecked?.getTime() || 0;
          const dateB = b.lastChecked?.getTime() || 0;
          comparison = dateA - dateB;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [feeds, searchQuery, selectedCategory, sortBy, sortOrder]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(feeds.map((feed) => feed.category))
    );
    return uniqueCategories.sort();
  }, [feeds]);

  // Calculate stats
  const stats: OpmlStats = useMemo(() => {
    return {
      totalFeeds: feeds.length,
      selectedFeeds: feeds.filter((f) => f.isSelected).length,
      categories: categories,
    };
  }, [feeds, categories]);

  return {
    feeds: filteredFeeds,
    allFeeds: feeds,
    stats,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    importOpml,
    importJson,
    exportFeeds,
    exportFeedsAsJson,
    updateFeed,
    deleteFeed,
    toggleFeedSelection,
    toggleAllSelection,
    bulkUpdateCategory,
    removeDuplicates,
    addCategory,
    validateRssFeeds,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

