"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TagsEditorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

export function TagsEditor({ tags = [], onTagsChange, className }: TagsEditorProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const tag = inputValue.trim();
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="添加标签..."
          className="h-8 text-sm"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddTag}
          className="h-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

