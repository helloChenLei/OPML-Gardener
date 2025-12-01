"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface OpmlUploaderProps {
  onFileLoad: (content: string, fileType: 'opml' | 'json') => void;
}

export function OpmlUploader({ onFileLoad }: OpmlUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const fileType = file.name.endsWith('.json') ? 'json' : 'opml';
      onFileLoad(content, fileType);
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".opml") || file.name.endsWith(".json"))) {
      handleFileRead(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            {isDragging ? (
              <FileText className="w-12 h-12 text-primary" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <p className="text-lg font-medium mb-1">
                上传 OPML 或 JSON 文件
              </p>
              <p className="text-sm text-muted-foreground">
                拖放文件到这里，或点击选择文件
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              选择文件
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".opml,.json"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </CardContent>
    </Card>
  );
}

