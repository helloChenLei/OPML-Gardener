"use client";

import { FeedItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useMemo } from "react";

interface ExportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeds: FeedItem[];
  onConfirmExport: (format: 'opml' | 'json') => void;
  exportType: "all" | "selected" | "current";
}

export function ExportPreviewDialog({
  open,
  onOpenChange,
  feeds,
  onConfirmExport,
  exportType,
}: ExportPreviewDialogProps) {
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, FeedItem[]> = {};
    feeds.forEach((feed) => {
      if (!groups[feed.category]) {
        groups[feed.category] = [];
      }
      groups[feed.category].push(feed);
    });
    return groups;
  }, [feeds]);

  const categories = Object.keys(groupedByCategory).sort();

  const handleConfirm = (format: 'opml' | 'json') => {
    onConfirmExport(format);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[80vh] flex flex-col"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>导出预览</DialogTitle>
          <DialogDescription>
            {exportType === "all"
              ? `即将导出 ${feeds.length} 个订阅源（全部）`
              : exportType === "selected"
              ? `即将导出 ${feeds.length} 个订阅源（已选）`
              : `即将导出 ${feeds.length} 个订阅源（当前视图）`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4">
          {categories.map((category) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{category}</h3>
                <Badge variant="secondary">
                  {groupedByCategory[category].length} 个
                </Badge>
              </div>
              <div className="space-y-1 pl-4">
                {groupedByCategory[category].map((feed) => (
                  <div
                    key={feed.id}
                    className="text-sm py-1 border-b last:border-0"
                  >
                    <div className="font-medium">{feed.title}</div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {feed.xmlUrl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => handleConfirm('opml')}>导出为 OPML</Button>
          <Button variant="secondary" onClick={() => handleConfirm('json')}>导出为 JSON</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

