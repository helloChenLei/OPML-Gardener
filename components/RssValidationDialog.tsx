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
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface RssValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate: (onProgress: (current: number, total: number) => void) => Promise<any>;
  totalFeeds: number;
}

export function RssValidationDialog({
  open,
  onOpenChange,
  onValidate,
  totalFeeds,
}: RssValidationDialogProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{ valid: number; invalid: number } | null>(null);

  const handleStartValidation = async () => {
    setIsValidating(true);
    setProgress({ current: 0, total: totalFeeds });
    setResults(null);

    const validationResults = await onValidate((current, total) => {
      setProgress({ current, total });
    });

    // Count valid and invalid
    let valid = 0;
    let invalid = 0;
    validationResults.forEach((result: any) => {
      if (result.isValid) {
        valid++;
      } else {
        invalid++;
      }
    });

    setResults({ valid, invalid });
    setIsValidating(false);
  };

  const handleClose = () => {
    if (!isValidating) {
      setProgress({ current: 0, total: 0 });
      setResults(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>RSS 链接有效性检查</DialogTitle>
          <DialogDescription>
            检查所有订阅源的 RSS 链接是否有效
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isValidating && !results && (
            <div className="text-center text-muted-foreground">
              <p>即将检查 {totalFeeds} 个订阅源</p>
              <p className="text-sm mt-2">这可能需要一些时间，请耐心等待</p>
            </div>
          )}

          {isValidating && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>正在验证...</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>进度</span>
                  <span>
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(progress.current / progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-semibold mb-3">验证完成</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>有效: {results.valid} 个</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span>无效: {results.invalid} 个</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!isValidating && !results && (
            <>
              <Button variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button onClick={handleStartValidation}>开始验证</Button>
            </>
          )}
          {!isValidating && results && (
            <Button onClick={handleClose}>关闭</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

