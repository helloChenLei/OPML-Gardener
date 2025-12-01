"use client";

import { FeedItem } from "@/types";
import { Trash2, ExternalLink, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { TagsEditor } from "./TagsEditor";

interface FeedTableProps {
  feeds: FeedItem[];
  categories: string[];
  onUpdateFeed: (id: string, updates: Partial<FeedItem>) => void;
  onDeleteFeed: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: (selected: boolean) => void;
  selectedCount: number;
  totalCount: number;
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
}: FeedTableProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  if (feeds.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">暂无数据</p>
        <p className="text-sm mt-2">请上传 OPML 文件开始使用</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50 sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left font-medium w-12">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onToggleAllSelection(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="p-3 text-left font-medium min-w-[150px]">分类</th>
            <th className="p-3 text-left font-medium min-w-[250px]">标题</th>
            <th className="p-3 text-left font-medium min-w-[200px]">标签</th>
            <th className="p-3 text-left font-medium min-w-[300px]">RSS 链接</th>
            <th className="p-3 text-left font-medium min-w-[300px]">网站链接</th>
            <th className="p-3 text-left font-medium w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed) => (
            <tr
              key={feed.id}
              className={`
                border-b transition-colors
                ${feed.isSelected ? "bg-primary/5" : "hover:bg-muted/30"}
              `}
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={feed.isSelected}
                  onChange={() => onToggleSelection(feed.id)}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
              <td className="p-3">
                <Select
                  value={feed.category}
                  onChange={(e) =>
                    onUpdateFeed(feed.id, { category: e.target.value })
                  }
                  className="h-9"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="p-3">
                <Input
                  value={feed.title}
                  onChange={(e) =>
                    onUpdateFeed(feed.id, { title: e.target.value })
                  }
                  className="h-9"
                />
              </td>
              <td className="p-3">
                <TagsEditor
                  tags={feed.tags || []}
                  onTagsChange={(tags) => onUpdateFeed(feed.id, { tags })}
                />
              </td>
              <td className="p-3">
                <Input
                  value={feed.xmlUrl}
                  onChange={(e) =>
                    onUpdateFeed(feed.id, { xmlUrl: e.target.value })
                  }
                  className="h-9 font-mono text-xs"
                  title={feed.xmlUrl}
                />
              </td>
              <td className="p-3">
                <Input
                  value={feed.htmlUrl || ""}
                  onChange={(e) =>
                    onUpdateFeed(feed.id, { htmlUrl: e.target.value })
                  }
                  className="h-9 font-mono text-xs"
                  title={feed.htmlUrl || ""}
                  placeholder="可选"
                />
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  {feed.htmlUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(feed.htmlUrl, "_blank")}
                      title="打开网站"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDeleteFeed(feed.id)}
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

