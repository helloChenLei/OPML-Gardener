"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy?: "title" | "category" | "date";
  onSortByChange?: (sortBy: "title" | "category" | "date") => void;
  sortOrder?: "asc" | "desc";
  onSortOrderChange?: (sortOrder: "asc" | "desc") => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy = "title",
  onSortByChange,
  sortOrder = "asc",
  onSortOrderChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            搜索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="搜索标题或链接..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Sorting */}
      {onSortByChange && onSortOrderChange && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              排序
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">排序依据</label>
              <Select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as "title" | "category" | "date")}
                className="mt-1"
              >
                <option value="title">标题</option>
                <option value="category">分类</option>
                <option value="date">验证时间</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">排序方式</label>
              <Select
                value={sortOrder}
                onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
                className="mt-1"
              >
                <option value="asc">升序</option>
                <option value="desc">降序</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            分类筛选
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange("all")}
              className={`
                w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
              `}
            >
              全部分类
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                  ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

