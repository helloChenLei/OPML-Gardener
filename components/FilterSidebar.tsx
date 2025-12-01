"use client";

import { Search, Filter, Shield, CheckCircle2, XCircle, Minus } from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { OpmlStats } from "@/types";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  validationFilter: "all" | "valid" | "invalid" | "unchecked";
  onValidationFilterChange: (filter: "all" | "valid" | "invalid" | "unchecked") => void;
  stats?: OpmlStats;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  validationFilter,
  onValidationFilterChange,
  stats,
}: FilterSidebarProps) {
  return (
    <div className="space-y-5">
      {/* Search */}
      <Card className="glass-effect shadow-lg border-2 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Search className="h-4 w-4 text-primary" />
            </div>
            搜索订阅源
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Input
            placeholder="搜索标题或链接..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Validation Status Filter */}
      <Card className="glass-effect shadow-lg border-2 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            验证状态
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <button
              onClick={() => onValidationFilterChange("all")}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                ${
                  validationFilter === "all"
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <span>全部状态</span>
              <Badge variant={validationFilter === "all" ? "outline" : "secondary"} className={validationFilter === "all" ? "border-white/50 text-white" : ""}>
                {stats?.totalFeeds || 0}
              </Badge>
            </button>
            <button
              onClick={() => onValidationFilterChange("valid")}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                ${
                  validationFilter === "valid"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20"
                    : "hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200"
                }
              `}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                有效
              </span>
              <Badge variant={validationFilter === "valid" ? "outline" : "secondary"} className={validationFilter === "valid" ? "border-white/50 text-white" : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"}>
                {stats?.validFeeds || 0}
              </Badge>
            </button>
            <button
              onClick={() => onValidationFilterChange("invalid")}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                ${
                  validationFilter === "invalid"
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20"
                    : "hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200"
                }
              `}
            >
              <span className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                无效
              </span>
              <Badge variant={validationFilter === "invalid" ? "outline" : "secondary"} className={validationFilter === "invalid" ? "border-white/50 text-white" : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"}>
                {stats?.invalidFeeds || 0}
              </Badge>
            </button>
            <button
              onClick={() => onValidationFilterChange("unchecked")}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                ${
                  validationFilter === "unchecked"
                    ? "bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <span className="flex items-center gap-2">
                <Minus className="h-4 w-4" />
                未检测
              </span>
              <Badge variant={validationFilter === "unchecked" ? "outline" : "secondary"} className={validationFilter === "unchecked" ? "border-white/50 text-white" : ""}>
                {stats?.uncheckedFeeds || 0}
              </Badge>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Filter */}
      <Card className="glass-effect shadow-lg border-2 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            分类筛选
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
            <button
              onClick={() => onCategoryChange("all")}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/20"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
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

