"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (categoryName: string) => void;
  existingCategories: string[];
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onAddCategory,
  existingCategories,
}: AddCategoryDialogProps) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      setError("分类名称不能为空");
      return;
    }

    if (existingCategories.includes(trimmedName)) {
      setError("该分类已存在");
      return;
    }

    onAddCategory(trimmedName);
    setCategoryName("");
    setError("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setCategoryName("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>添加新分类</DialogTitle>
          <DialogDescription>
            创建一个新的分类来组织您的订阅源
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">分类名称</label>
            <Input
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder="例如: 技术博客"
              className="mt-1"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSubmit}>添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

