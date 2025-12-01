"use client";

import { useState, useRef } from "react";
import { useOpml } from "@/hooks/useOpml";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { OpmlUploader } from "@/components/OpmlUploader";
import { FeedTable } from "@/components/FeedTable";
import { FilterSidebar } from "@/components/FilterSidebar";
import { AddCategoryDialog } from "@/components/AddCategoryDialog";
import { ExportPreviewDialog } from "@/components/ExportPreviewDialog";
import { BulkEditDialog } from "@/components/BulkEditDialog";
import { RssValidationDialog } from "@/components/RssValidationDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Shield,
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
  } = useOpml();

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [exportPreviewType, setExportPreviewType] = useState<"all" | "selected">("all");
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

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

  const handleExportAll = () => {
    setExportPreviewType("all");
    setShowExportPreview(true);
  };

  const handleExportSelected = () => {
    setExportPreviewType("selected");
    setShowExportPreview(true);
  };

  const handleConfirmExport = (format: 'opml' | 'json') => {
    const selectedOnly = exportPreviewType === "selected";
    const result = format === 'json' 
      ? exportFeedsAsJson(selectedOnly) 
      : exportFeeds(selectedOnly);
    
    if (result.success) {
      showNotification(`成功导出 ${result.count} 个订阅源为 ${format.toUpperCase()}`, "success");
    } else {
      showNotification(`导出失败: ${result.error}`, "error");
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

  const handleBulkUpdateCategory = (feedIds: string[], newCategory: string) => {
    bulkUpdateCategory(feedIds, newCategory);
    showNotification(`已将 ${feedIds.length} 个订阅源移动到 ${newCategory}`, "success");
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
          handleExportAll();
        }
      },
      description: "导出全部",
    },
    {
      key: "a",
      ctrl: true,
      handler: () => {
        if (stats.totalFeeds > 0) {
          toggleAllSelection(true);
        }
      },
      description: "全选",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Rss className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">OPML Gardener</h1>
                <p className="text-sm text-muted-foreground">
                  RSS订阅管理工具
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {stats.totalFeeds > 0 && (
                <>
                  <div className="flex items-center gap-1 border-r pr-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={undo}
                      disabled={!canUndo}
                      title="撤销 (Ctrl+Z)"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={redo}
                      disabled={!canRedo}
                      title="重做 (Ctrl+Y)"
                    >
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    总计: {stats.totalFeeds} 个订阅源
                  </Badge>
                  {stats.selectedFeeds > 0 && (
                    <Badge className="text-sm">
                      已选: {stats.selectedFeeds} 个
                    </Badge>
                  )}
                  <div className="border-l pl-3">
                    <ThemeToggle />
                  </div>
                </>
              )}
              {stats.totalFeeds === 0 && <ThemeToggle />}
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right">
          <Card
            className={`
              ${
                notification.type === "success"
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }
            `}
          >
            <CardContent className="p-4 flex items-center gap-3">
              {notification.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
              <p
                className={`text-sm font-medium ${
                  notification.type === "success"
                    ? "text-green-900"
                    : "text-red-900"
                }`}
              >
                {notification.message}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {stats.totalFeeds === 0 ? (
          // Empty state - Show uploader
          <div className="max-w-2xl mx-auto mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">欢迎使用 OPML Gardener</h2>
              <p className="text-muted-foreground">
                导入您的 OPML 文件，开始整理和管理您的 RSS 订阅源
              </p>
            </div>
            <OpmlUploader onFileLoad={handleFileLoad} />
          </div>
        ) : (
          // Main workspace with filters and table
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />

              {/* Actions */}
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowAddCategoryDialog(true)}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    添加新分类
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowBulkEditDialog(true)}
                    disabled={stats.selectedFeeds === 0}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    批量编辑分类 ({stats.selectedFeeds})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowValidationDialog(true)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    验证 RSS 链接
                  </Button>
                  <Button
                    variant="default"
                    className="w-full justify-start"
                    onClick={handleExportAll}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    导出全部
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleExportSelected}
                    disabled={stats.selectedFeeds === 0}
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    导出已选 ({stats.selectedFeeds})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleRemoveDuplicates}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    去除重复
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Main Table */}
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>订阅源列表</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      显示 {feeds.length} / {stats.totalFeeds} 个订阅源
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <FeedTable
                    feeds={feeds}
                    categories={categories}
                    onUpdateFeed={updateFeed}
                    onDeleteFeed={deleteFeed}
                    onToggleSelection={toggleFeedSelection}
                    onToggleAllSelection={toggleAllSelection}
                    selectedCount={stats.selectedFeeds}
                    totalCount={allFeeds.length}
                  />
                </CardContent>
              </Card>
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
        feeds={exportPreviewType === "all" ? allFeeds : allFeeds.filter((f) => f.isSelected)}
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
      <RssValidationDialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
        onValidate={validateRssFeeds}
        totalFeeds={stats.totalFeeds}
      />
    </div>
  );
}

