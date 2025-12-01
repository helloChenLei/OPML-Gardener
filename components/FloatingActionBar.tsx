"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { FolderInput, Trash2, X, Plus } from "lucide-react";

interface FloatingActionBarProps {
  selectedCount: number;
  categories: string[];
  onMoveToCategory: (categoryName: string) => void;
  onDelete: () => void;
  onClearSelection: () => void;
  onCreateCategory: () => void;
}

export function FloatingActionBar({
  selectedCount,
  categories,
  onMoveToCategory,
  onDelete,
  onClearSelection,
  onCreateCategory,
}: FloatingActionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-8 left-1/2 animate-slide-in-bottom"
      style={{ 
        transform: 'translateX(-50%)',
        willChange: 'transform, opacity',
        zIndex: 50
      }}
    >
      <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-full shadow-2xl border border-gray-700/50 px-6 py-3 flex items-center gap-4 backdrop-blur-md">
        {/* Selection Count */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/80">
            已选择 <span className="font-semibold text-white">{selectedCount}</span> 项
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20"></div>

        {/* Move to Category */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-white hover:bg-white/10 hover:text-white"
            >
              <FolderInput className="h-4 w-4 mr-2" />
              移动到分类
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="center" 
            side="top" 
            className="w-56 max-h-[320px] overflow-y-auto"
            sideOffset={8}
          >
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground sticky top-0 bg-popover">
              选择分类
            </div>
            <div>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => onMoveToCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </div>
            <div className="h-px bg-border my-1"></div>
            <DropdownMenuItem
              onClick={onCreateCategory}
              className="text-primary"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              创建新分类
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20"></div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          删除
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20"></div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white/60 hover:bg-white/10 hover:text-white"
          onClick={onClearSelection}
          title="清除选择"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

