"use client";

import { useState } from "react";
import { useOpml } from "@/hooks/useOpml";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { OpmlUploader } from "@/components/OpmlUploader";
import { FeedTable } from "@/components/FeedTable";
import { AddCategoryDialog } from "@/components/AddCategoryDialog";
import { ExportPreviewDialog } from "@/components/ExportPreviewDialog";
import { BulkEditDialog } from "@/components/BulkEditDialog";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Download,
  FileCheck,
  Sparkles,
  Rss,
  CheckCircle2,
  Undo2,
  Redo2,
  FolderPlus,
  Edit3,
  Search,
  Filter,
  XCircle,
  Minus,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const {
    feeds,
    allFeeds,
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
  } = useOpml();

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [exportPreviewType, setExportPreviewType] = useState<"all" | "selected" | "current">("all");
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileLoad = (content: string, fileType: 'opml' | 'json') => {
    const result = fileType === 'json' ? importJson(content) : importOpml(content);
    if (result.success) {
      showNotification(`成功导入 ${result.count} 个订阅源`, "success");
    } else {
      showNotification(`导入失败: ${result.error}`, "error");
    }
  };

  const handleExport = (type: "all" | "selected" | "current") => {
    setExportPreviewType(type);
    setShowExportPreview(true);
  };

  const handleConfirmExport = (format: 'opml' | 'json') => {
    let feedsToExport = allFeeds;
    let exportCount = 0;
    
    if (exportPreviewType === "selected") {
      feedsToExport = allFeeds.filter((f) => f.isSelected);
      exportCount = feedsToExport.length;
    } else if (exportPreviewType === "current") {
      feedsToExport = feeds; // filtered feeds
      exportCount = feedsToExport.length;
    } else {
      exportCount = allFeeds.length;
    }

    if (exportCount === 0) {
      showNotification("没有可导出的订阅源", "error");
      return;
    }

    try {
      if (format === 'json') {
        const jsonContent = require('@/lib/json-handler').exportToJson(feedsToExport);
        require('@/lib/json-handler').downloadJson(jsonContent, `opml_export_${new Date().toISOString().split('T')[0]}.json`);
      } else {
        const opmlContent = require('@/lib/opml-parser').exportOpml(feedsToExport);
        require('@/lib/opml-parser').downloadOpml(opmlContent, `opml_export_${new Date().toISOString().split('T')[0]}.opml`);
      }
      showNotification(`成功导出 ${exportCount} 个订阅源为 ${format.toUpperCase()}`, "success");
    } catch (error) {
      showNotification(`导出失败: ${error}`, "error");
    }
  };

  const handleRemoveDuplicates = () => {
    const removed = removeDuplicates();
    if (removed > 0) {
      showNotification(`已删除 ${removed} 个重复订阅源`, "success");
    } else {
      showNotification("未发现重复订阅源", "success");
    }
  };

  const handleAddCategory = (categoryName: string) => {
    const result = addCategory(categoryName);
    if (result.success) {
      showNotification(`已添加新分类: ${categoryName}`, "success");
    }
  };

  const handleRefreshDates = async () => {
    const result = await refreshLastUpdatedDates();
    if (result.success) {
      showNotification(`成功刷新 ${result.count}/${result.total} 个订阅源的更新时间`, "success");
    } else {
      showNotification(`刷新失败: ${result.error}`, "error");
    }
  };

  const handleBulkUpdateCategory = (feedIds: string[], newCategory: string) => {
    bulkUpdateCategory(feedIds, newCategory);
    showNotification(`已将 ${feedIds.length} 个订阅源移动到 ${newCategory}`, "success");
  };

  const handleFloatingBarMoveToCategory = (categoryName: string) => {
    const selectedIds = allFeeds.filter((f) => f.isSelected).map((f) => f.id);
    if (selectedIds.length > 0) {
      handleBulkUpdateCategory(selectedIds, categoryName);
    }
  };

  const handleFloatingBarDelete = () => {
    const count = bulkDeleteFeeds();
    if (count > 0) {
      showNotification(`已删除 ${count} 个订阅源`, "success");
    }
  };

  const handleFloatingBarClearSelection = () => {
    toggleAllSelection(false);
  };

  const handleSortChange = (field: typeof sortBy) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "z",
      ctrl: true,
      handler: undo,
      description: "撤销",
    },
    {
      key: "y",
      ctrl: true,
      handler: redo,
      description: "重做",
    },
    {
      key: "s",
      ctrl: true,
      handler: () => {
        if (stats.totalFeeds > 0) {
          handleExport("all");
        }
      },
      description: "导出全部",
    },
    {
      key: "a",
      ctrl: true,
      handler: () => {
        if (feeds.length > 0) {
          const feedIds = feeds.map(f => f.id);
          toggleAllSelection(true, feedIds);
        }
      },
      description: "全选",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b glass-effect sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-br from-primary to-purple-600 text-white p-3.5 rounded-2xl shadow-lg">
                  <Rss className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  OPML Gardener
                </h1>
                <p className="text-sm text-muted-foreground">
                  优雅管理您的 RSS 订阅源
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in-0 slide-in-from-top-2">
          <Card
            className={`
              shadow-lg min-w-[320px]
              ${
                notification.type === "success"
                  ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50"
                  : "border-red-400 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50"
              }
            `}
          >
            <CardContent className="p-4 flex items-center justify-center gap-3">
              {notification.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              )}
              <p
                className={`text-sm font-medium text-center ${
                  notification.type === "success"
                    ? "text-green-900 dark:text-green-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {notification.message}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-8 py-10">
        {stats.totalFeeds === 0 ? (
          // Empty state - Show uploader
          <div className="max-w-3xl mx-auto mt-20">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl mb-4">
                <Rss className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                开始管理您的订阅源
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                导入 OPML 或 JSON 文件，即可轻松整理、筛选和导出您的 RSS 订阅
              </p>
            </div>
            <OpmlUploader onFileLoad={handleFileLoad} />
          </div>
        ) : (
          // Main workspace - Notion-style layout
          <div className="w-full">
            {/* Notion-style Toolbar */}
            <div className="h-14 border-b bg-white dark:bg-slate-950 flex items-center justify-between px-4 gap-4">
              {/* Left side: Search + Category + Status filters */}
              <div className="flex items-center gap-3 flex-1">
                {/* Search Input */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索订阅源..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm border-slate-200 dark:border-slate-700"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 w-40 text-sm border-slate-200 dark:border-slate-700"
                >
                  <option value="all">全部分类</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>

                {/* Status Filter */}
                <Select
                  value={validationFilter}
                  onChange={(e) => setValidationFilter(e.target.value as "all" | "valid" | "invalid" | "unchecked")}
                  className="h-9 w-32 text-sm border-slate-200 dark:border-slate-700"
                >
                  <option value="all">全部状态</option>
                  <option value="valid">有效</option>
                  <option value="invalid">无效</option>
                  <option value="unchecked">未检测</option>
                </Select>

                {/* Results count */}
                <span className="text-sm text-muted-foreground">
                  显示 <span className="font-medium text-foreground">{feeds.length}</span> / {allFeeds.length}
                </span>
              </div>

              {/* Right side: Action buttons */}
              <div className="flex items-center gap-2">
                {/* Undo/Redo Button Group */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={undo}
                    disabled={!canUndo}
                    title="撤销 (Ctrl+Z)"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={redo}
                    disabled={!canRedo}
                    title="重做 (Ctrl+Y)"
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                {/* Export Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-9 text-sm gap-1.5 px-3"
                    >
                      <Download className="h-4 w-4" />
                      <span>导出</span>
                      <div className="h-4 w-px bg-white/20 mx-0.5"></div>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleExport("all")}>
                      <Download className="h-3.5 w-3.5 mr-2" />
                      导出全部 ({allFeeds.length})
                    </DropdownMenuItem>
                    {stats.selectedFeeds > 0 && (
                      <DropdownMenuItem onClick={() => handleExport("selected")}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-primary" />
                        导出选中 ({stats.selectedFeeds})
                      </DropdownMenuItem>
                    )}
                    {(searchQuery || selectedCategory !== "all" || validationFilter !== "all") && (
                      <DropdownMenuItem onClick={() => handleExport("current")}>
                        <Filter className="h-3.5 w-3.5 mr-2 text-purple-600" />
                        导出当前视图 ({feeds.length})
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={handleRefreshDates}
                  disabled={isRefreshingDates}
                  title={isRefreshingDates ? `刷新中... ${refreshProgress.completed}/${refreshProgress.total}` : "刷新更新时间"}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshingDates ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={handleRemoveDuplicates}
                  title="去重"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table without card wrapper */}
            <div className="w-full overflow-hidden">
              <FeedTable
                feeds={feeds}
                categories={categories}
                onUpdateFeed={updateFeed}
                onDeleteFeed={deleteFeed}
                onToggleSelection={toggleFeedSelection}
                onToggleAllSelection={toggleAllSelection}
                selectedCount={stats.selectedFeeds}
                totalCount={allFeeds.length}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                isValidating={isValidating}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                validationFilter={validationFilter}
                onValidationFilterChange={setValidationFilter}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                stats={stats}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            OPML Gardener - 本地优先的 RSS 订阅管理工具 | 所有数据在浏览器本地处理
          </p>
        </div>
      </footer>

      {/* Floating Action Bar */}
      {stats.selectedFeeds > 0 && (
        <FloatingActionBar
          selectedCount={stats.selectedFeeds}
          categories={categories}
          onMoveToCategory={handleFloatingBarMoveToCategory}
          onDelete={handleFloatingBarDelete}
          onClearSelection={handleFloatingBarClearSelection}
          onCreateCategory={() => setShowAddCategoryDialog(true)}
        />
      )}

      {/* Dialogs */}
      <AddCategoryDialog
        open={showAddCategoryDialog}
        onOpenChange={setShowAddCategoryDialog}
        onAddCategory={handleAddCategory}
        existingCategories={categories}
      />
      <ExportPreviewDialog
        open={showExportPreview}
        onOpenChange={setShowExportPreview}
        feeds={
          exportPreviewType === "all" 
            ? allFeeds 
            : exportPreviewType === "selected"
            ? allFeeds.filter((f) => f.isSelected)
            : feeds
        }
        onConfirmExport={handleConfirmExport}
        exportType={exportPreviewType}
      />
      <BulkEditDialog
        open={showBulkEditDialog}
        onOpenChange={setShowBulkEditDialog}
        selectedFeeds={allFeeds.filter((f) => f.isSelected)}
        categories={categories}
        onBulkUpdate={handleBulkUpdateCategory}
      />
    </div>
  );
}

