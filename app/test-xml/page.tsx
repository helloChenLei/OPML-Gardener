"use client";

import { useState } from "react";
import { exportOpml } from "@/lib/opml-parser";
import { FeedItem } from "@/types";
import { Button } from "@/components/ui/button";

export default function TestXMLPage() {
  const [result, setResult] = useState<string>("");

  const runTest = () => {
    // 创建包含所有需要转义的特殊字符的测试数据
    const testFeeds: FeedItem[] = [
      {
        id: "1",
        title: "Arts & Culture",
        xmlUrl: "https://example.com/feed?a=1&b=2",
        htmlUrl: "https://example.com/page",
        category: "Test Category",
        isSelected: false,
      },
      {
        id: "2",
        title: 'Title with "quotes" and <brackets>',
        xmlUrl: "https://example.com/feed2",
        htmlUrl: "https://example.com/page?x=<value>",
        category: "Test's Category",
        isSelected: false,
      },
      {
        id: "3",
        title: "Multiple & < > \" ' symbols",
        xmlUrl: "https://example.com/feed3?param1=value1&param2=value2&param3=<test>",
        htmlUrl: "https://example.com",
        category: "Special Characters & Symbols",
        isSelected: false,
      },
    ];

    // 生成 OPML
    const opmlOutput = exportOpml(testFeeds);
    
    // 检查转义
    const checks = [];
    
    // 检查 1: "Arts & Culture" 应该被转义为 "Arts &amp; Culture"
    if (opmlOutput.includes('text="Arts & Culture"')) {
      checks.push('❌ 失败: "Arts & Culture" 未被转义');
    } else if (opmlOutput.includes('text="Arts &amp; Culture"')) {
      checks.push('✓ 通过: "Arts & Culture" 正确转义');
    }
    
    // 检查 2: URL 中的 & 应该被转义
    if (opmlOutput.includes('xmlUrl="https://example.com/feed?a=1&b=2"')) {
      checks.push('❌ 失败: URL 中的 & 未被转义');
    } else if (opmlOutput.includes('&amp;b=2')) {
      checks.push('✓ 通过: URL 中的 & 正确转义');
    }
    
    // 检查 3: 双引号应该被转义或使用单引号包裹
    if (opmlOutput.includes('&quot;')) {
      checks.push('✓ 通过: 双引号被转义为 &quot;');
    }
    
    // 检查 4: 尖括号应该被转义
    if (opmlOutput.includes('&lt;') && opmlOutput.includes('&gt;')) {
      checks.push('✓ 通过: 尖括号被正确转义');
    }
    
    // 检查 5: 撇号/单引号
    if (opmlOutput.includes('&apos;') || opmlOutput.includes("Test's")) {
      checks.push('✓ 通过: 撇号被正确处理');
    }
    
    const summary = checks.join('\n');
    const allPassed = !summary.includes('❌');
    
    setResult(`=== XML 转义测试结果 ===\n\n${summary}\n\n${allPassed ? '✅ 所有测试通过！fast-xml-parser 自动处理了 XML 转义。' : '❌ 某些测试失败！需要添加手动转义。'}\n\n=== 生成的 OPML（前 1000 字符）===\n${opmlOutput.substring(0, 1000)}...`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">XML 转义测试</h1>
      <p className="mb-4 text-muted-foreground">
        此页面测试 fast-xml-parser 是否正确转义 XML 特殊字符
      </p>
      
      <Button onClick={runTest} className="mb-4">
        运行测试
      </Button>
      
      {result && (
        <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}

