"use client";

import { FeedItem } from "@/types";
import { Trash2, ExternalLink, CheckCircle2, XCircle, Minus, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

interface FeedTableProps {
  feeds: FeedItem[];
  categories: string[];
  onUpdateFeed: (id: string, updates: Partial<FeedItem>) => void;
  onDeleteFeed: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: (selected: boolean) => void;
  selectedCount: number;
  totalCount: number;
  sortBy: "title" | "category" | "xmlUrl" | "isValid" | "lastUpdated";
  sortOrder: "asc" | "desc";
  onSortChange: (field: "title" | "category" | "xmlUrl" | "isValid" | "lastUpdated") => void;
  isValidating?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  validationFilter: "all" | "valid" | "invalid" | "unchecked";
  onValidationFilterChange: (filter: "all" | "valid" | "invalid" | "unchecked") => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  stats?: {
    validFeeds?: number;
    invalidFeeds?: number;
    uncheckedFeeds?: number;
  };
}

export function FeedTable({
  feeds,
  categories,
  onUpdateFeed,
  onDeleteFeed,
  onToggleSelection,
  onToggleAllSelection,
  selectedCount,
  totalCount,
  sortBy,
  sortOrder,
  onSortChange,
  isValidating = false,
  searchQuery,
  onSearchChange,
  validationFilter,
  onValidationFilterChange,
  selectedCategory,
  onCategoryChange,
  stats,
}: FeedTableProps) {
  // Check if all VISIBLE feeds are selected
  const visibleSelectedCount = feeds.filter(f => f.isSelected).length;
  const allSelected = visibleSelectedCount === feeds.length && feeds.length > 0;
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingUrlId, setEditingUrlId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  const getValidationIcon = (feed: FeedItem) => {
    if (feed.isValid === undefined) {
      return isValidating ? (
        <span title="验证中">
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        </span>
      ) : (
        <span title="未检测">
          <Minus className="h-4 w-4 text-muted-foreground" />
        </span>
      );
    }
    return feed.isValid ? (
      <span title="有效">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      </span>
    ) : (
      <span title="无效">
        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      </span>
    );
  };

  if (feeds.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">暂无数据</p>
        <p className="text-xs mt-2">请上传 OPML 文件开始使用</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table */}
      <div className="w-full overflow-auto custom-scrollbar max-h-[calc(100vh-280px)]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 border-b">
            <tr>
            <th className="px-3 py-2.5 text-left font-medium w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  const feedIds = feeds.map(f => f.id);
                  onToggleAllSelection(e.target.checked, feedIds);
                }}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="px-3 py-2.5 text-left font-medium w-14">
              <button
                onClick={() => onSortChange("isValid")}
                className="flex items-center gap-1 hover:text-primary transition-colors text-sm"
                title="点击排序"
              >
                状态
                <SortIcon field="isValid" />
              </button>
            </th>
            <th className="px-3 py-2.5 text-left font-medium min-w-[130px]">
              <button
                onClick={() => onSortChange("category")}
                className="flex items-center gap-1 hover:text-primary transition-colors text-sm"
                title="点击排序"
              >
                分类
                <SortIcon field="category" />
              </button>
            </th>
            <th className="px-3 py-2.5 text-left font-medium min-w-[200px]">
              <button
                onClick={() => onSortChange("title")}
                className="flex items-center gap-1 hover:text-primary transition-colors text-sm"
                title="点击排序"
              >
                标题
                <SortIcon field="title" />
              </button>
            </th>
            <th className="px-3 py-2.5 text-left font-medium min-w-[250px]">
              <button
                onClick={() => onSortChange("xmlUrl")}
                className="flex items-center gap-1 hover:text-primary transition-colors text-sm"
                title="点击排序"
              >
                RSS 链接
                <SortIcon field="xmlUrl" />
              </button>
            </th>
            <th className="px-3 py-2.5 text-left font-medium min-w-[120px]">
              <button
                onClick={() => onSortChange("lastUpdated")}
                className="flex items-center gap-1 hover:text-primary transition-colors text-sm"
                title="点击排序"
              >
                最后更新
                <SortIcon field="lastUpdated" />
              </button>
            </th>
            <th className="px-3 py-2.5 text-left font-medium min-w-[80px]">操作</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed) => (
            <tr
              key={feed.id}
              className={`
                border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-150 group
                ${feed.isSelected 
                  ? "bg-primary/5 border-primary/20" 
                  : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                }
              `}
            >
              <td className="px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={feed.isSelected}
                  onChange={() => onToggleSelection(feed.id)}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
              <td className="px-3 py-2.5 text-center">
                {getValidationIcon(feed)}
              </td>
              <td className="px-3 py-2.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button>
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-secondary/80 transition-colors text-xs"
                      >
                        {feed.category}
                      </Badge>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => onUpdateFeed(feed.id, { category: cat })}
                      >
                        {cat}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
              <td className="px-3 py-2.5">
                {editingTitleId === feed.id ? (
                  <Input
                    value={feed.title}
                    onChange={(e) => onUpdateFeed(feed.id, { title: e.target.value })}
                    onBlur={() => setEditingTitleId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") {
                        setEditingTitleId(null);
                      }
                    }}
                    className="h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setEditingTitleId(feed.id)}
                    className="text-left w-full hover:text-primary transition-colors text-sm"
                  >
                    {feed.title}
                  </button>
                )}
              </td>
              <td className="px-3 py-2.5">
                {editingUrlId === feed.id ? (
                  <Input
                    value={feed.xmlUrl}
                    onChange={(e) => onUpdateFeed(feed.id, { xmlUrl: e.target.value })}
                    onBlur={() => setEditingUrlId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") {
                        setEditingUrlId(null);
                      }
                    }}
                    className="h-7 text-sm font-mono"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingUrlId(feed.id)}
                      className="font-mono text-xs text-muted-foreground truncate max-w-[300px] hover:text-foreground transition-colors"
                      title={feed.xmlUrl}
                    >
                      {feed.xmlUrl}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(feed.xmlUrl, "_blank");
                      }}
                      className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="在新标签页打开"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-3 py-2.5">
                <span className="text-xs text-muted-foreground">
                  {feed.lastUpdated 
                    ? new Date(feed.lastUpdated).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\//g, '-')
                    : '—'}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeleteFeed(feed.id)}
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
