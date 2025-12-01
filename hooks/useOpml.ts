"use client";

import { useState, useMemo } from "react";
import { FeedItem, OpmlStats } from "@/types";
import { parseOpml, exportOpml, downloadOpml } from "@/lib/opml-parser";
import { parseJson, exportToJson, downloadJson } from "@/lib/json-handler";
import { useHistory } from "./useHistory";
import { validateMultipleRssUrls } from "@/lib/rss-validator";
import { batchCheckFeeds } from "@/lib/feed-health-checker";

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
  const [validationFilter, setValidationFilter] = useState<"all" | "valid" | "invalid" | "unchecked">("all");
  const [sortBy, setSortBy] = useState<"title" | "category" | "xmlUrl" | "isValid" | "lastUpdated">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isValidating, setIsValidating] = useState(false);
  const [isRefreshingDates, setIsRefreshingDates] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState({ completed: 0, total: 0 });

  // Import OPML file
  const importOpml = (fileContent: string) => {
    try {
      const parsedFeeds = parseOpml(fileContent);
      resetHistory(parsedFeeds);
      // Auto-start validation after import
      setTimeout(() => startAutoValidation(parsedFeeds), 500);
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
      // Auto-start validation after import if not already validated
      setTimeout(() => {
        const needsValidation = parsedFeeds.some(f => f.isValid === undefined);
        if (needsValidation) {
          startAutoValidation(parsedFeeds);
        }
      }, 500);
      return { success: true, count: parsedFeeds.length };
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return { success: false, error: String(error) };
    }
  };

  // Auto validation in background - fast batch validation
  const startAutoValidation = async (feedsToValidate: FeedItem[]) => {
    if (!feedsToValidate || feedsToValidate.length === 0) return;
    
    setIsValidating(true);
    
    try {
      // Batch validate all URLs at once (fast URL format check only)
      const urls = feedsToValidate.map(f => f.xmlUrl);
      const results = await validateMultipleRssUrls(urls);
      
      // Update all feeds at once
      setFeeds((prevFeeds) => {
        if (!prevFeeds || !Array.isArray(prevFeeds)) return prevFeeds;
        
        return prevFeeds.map((f) => {
          const validationResult = results.get(f.xmlUrl);
          if (validationResult) {
            return {
              ...f,
              isValid: validationResult.isValid,
              lastChecked: new Date(),
              lastUpdated: validationResult.lastUpdated,
            };
          }
          return f;
        });
      });
    } catch (error) {
      console.error('Batch validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // Export selected or all feeds as OPML
  const exportFeeds = (selectedOnly = false) => {
    if (!feeds || !Array.isArray(feeds)) {
      return { success: false, error: "No feeds available" };
    }

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
    if (!feeds || !Array.isArray(feeds)) {
      return { success: false, error: "No feeds available" };
    }

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

  // Bulk delete selected feeds
  const bulkDeleteFeeds = () => {
    const selectedFeeds = feeds.filter((f) => f.isSelected);
    const count = selectedFeeds.length;
    setFeeds((prev) => prev.filter((feed) => !feed.isSelected));
    return count;
  };

  // Toggle feed selection
  const toggleFeedSelection = (id: string) => {
    setFeeds((prev) =>
      prev.map((feed) =>
        feed.id === id ? { ...feed, isSelected: !feed.isSelected } : feed
      )
    );
  };

  // Select/deselect all feeds (or specific feeds if feedIds provided)
  const toggleAllSelection = (selected: boolean, feedIds?: string[]) => {
    setFeeds((prev) => prev.map((feed) => {
      // If feedIds is provided, only toggle those feeds
      if (feedIds && feedIds.length > 0) {
        return feedIds.includes(feed.id) ? { ...feed, isSelected: selected } : feed;
      }
      // Otherwise toggle all feeds
      return { ...feed, isSelected: selected };
    }));
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
    if (!feeds || !Array.isArray(feeds)) {
      return 0;
    }

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

  // Validate RSS URLs (kept for backward compatibility but not used in UI)
  const validateRssFeeds = async (
    onProgress?: (current: number, total: number) => void
  ) => {
    if (!feeds || !Array.isArray(feeds)) {
      return new Map();
    }

    const urls = feeds.map((f) => f.xmlUrl);
    const results = await validateMultipleRssUrls(urls, onProgress);

    // Update feeds with validation results
    const updatedFeeds = feeds.map((feed) => {
      const result = results.get(feed.xmlUrl);
      return {
        ...feed,
        isValid: result?.isValid ?? undefined,
        lastChecked: new Date(),
        lastUpdated: result?.lastUpdated,
      };
    });

    setFeeds(updatedFeeds);
    return results;
  };

  // Refresh last updated dates for all feeds
  const refreshLastUpdatedDates = async () => {
    if (!feeds || !Array.isArray(feeds) || feeds.length === 0) {
      return { success: false, error: "没有可刷新的订阅源" };
    }

    setIsRefreshingDates(true);
    setRefreshProgress({ completed: 0, total: feeds.length });

    try {
      const urls = feeds.map((f) => f.xmlUrl);
      
      // Batch process with concurrency limit of 5
      const results = await batchCheckFeeds(urls, 5, (completed, total) => {
        setRefreshProgress({ completed, total });
      });

      // Update feeds with new dates
      setFeeds((prevFeeds) => {
        if (!prevFeeds || !Array.isArray(prevFeeds)) return prevFeeds;
        
        return prevFeeds.map((feed) => {
          const result = results.get(feed.xmlUrl);
          if (result && result.success && result.lastUpdated) {
            return {
              ...feed,
              lastUpdated: new Date(result.lastUpdated),
            };
          }
          return feed;
        });
      });

      const successCount = Array.from(results.values()).filter(r => r.success).length;
      return { 
        success: true, 
        count: successCount,
        total: feeds.length 
      };
    } catch (error) {
      console.error("Failed to refresh dates:", error);
      return { success: false, error: String(error) };
    } finally {
      setIsRefreshingDates(false);
      setRefreshProgress({ completed: 0, total: 0 });
    }
  };

  // Filtered feeds based on search, category, and validation status
  const filteredFeeds = useMemo(() => {
    // Safety check: ensure feeds is always an array
    if (!feeds || !Array.isArray(feeds)) {
      return [];
    }

    let result = feeds.filter((feed) => {
      const matchesSearch =
        searchQuery === "" ||
        feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.xmlUrl.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || feed.category === selectedCategory;

      const matchesValidation =
        validationFilter === "all" ||
        (validationFilter === "valid" && feed.isValid === true) ||
        (validationFilter === "invalid" && feed.isValid === false) ||
        (validationFilter === "unchecked" && feed.isValid === undefined);

      return matchesSearch && matchesCategory && matchesValidation;
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
        case "xmlUrl":
          comparison = a.xmlUrl.localeCompare(b.xmlUrl);
          break;
        case "isValid":
          const statusA = a.isValid === undefined ? -1 : a.isValid ? 1 : 0;
          const statusB = b.isValid === undefined ? -1 : b.isValid ? 1 : 0;
          comparison = statusA - statusB;
          break;
        case "lastUpdated":
          const dateA = a.lastUpdated?.getTime() || 0;
          const dateB = b.lastUpdated?.getTime() || 0;
          comparison = dateA - dateB;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [feeds, searchQuery, selectedCategory, validationFilter, sortBy, sortOrder]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!feeds || !Array.isArray(feeds)) {
      return [];
    }
    const uniqueCategories = Array.from(
      new Set(feeds.map((feed) => feed.category))
    );
    return uniqueCategories.sort();
  }, [feeds]);

  // Calculate stats
  const stats: OpmlStats = useMemo(() => {
    if (!feeds || !Array.isArray(feeds)) {
      return {
        totalFeeds: 0,
        selectedFeeds: 0,
        categories: [],
        validFeeds: 0,
        invalidFeeds: 0,
        uncheckedFeeds: 0,
      };
    }
    return {
      totalFeeds: feeds.length,
      selectedFeeds: feeds.filter((f) => f.isSelected).length,
      categories: categories,
      validFeeds: feeds.filter((f) => f.isValid === true).length,
      invalidFeeds: feeds.filter((f) => f.isValid === false).length,
      uncheckedFeeds: feeds.filter((f) => f.isValid === undefined).length,
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
    validationFilter,
    setValidationFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isValidating,
    isRefreshingDates,
    refreshProgress,
    importOpml,
    importJson,
    exportFeeds,
    exportFeedsAsJson,
    updateFeed,
    deleteFeed,
    bulkDeleteFeeds,
    toggleFeedSelection,
    toggleAllSelection,
    bulkUpdateCategory,
    removeDuplicates,
    addCategory,
    refreshLastUpdatedDates,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

