"use client";

import { useState } from "react";
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
import { Select } from "./ui/select";

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFeeds: FeedItem[];
  categories: string[];
  onBulkUpdate: (feedIds: string[], newCategory: string) => void;
}

export function BulkEditDialog({
  open,
  onOpenChange,
  selectedFeeds,
  categories,
  onBulkUpdate,
}: BulkEditDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = () => {
    if (!selectedCategory) return;

    const feedIds = selectedFeeds.map((f) => f.id);
    onBulkUpdate(feedIds, selectedCategory);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedCategory("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>批量编辑分类</DialogTitle>
          <DialogDescription>
            将 {selectedFeeds.length} 个已选订阅源移动到指定分类
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">目标分类</label>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1"
            >
              <option value="">选择分类...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div className="border rounded-lg p-3 max-h-64 overflow-y-auto">
            <p className="text-sm font-medium mb-2">已选订阅源:</p>
            <div className="space-y-1">
              {selectedFeeds.map((feed) => (
                <div
                  key={feed.id}
                  className="text-sm py-1 border-b last:border-0"
                >
                  <div className="font-medium truncate">{feed.title}</div>
                  <div className="text-xs text-muted-foreground">
                    当前分类: {feed.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedCategory}>
            确认修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

