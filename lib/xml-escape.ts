/**
 * 安全转义 XML 实体字符
 * 处理所有 5 个 XML 保留字符
 * 
 * 根据 XML 1.0 规范：
 * - & (ampersand) -> &amp;
 * - < (less than) -> &lt;
 * - > (greater than) -> &gt;
 * - " (double quote) -> &quot;
 * - ' (apostrophe) -> &apos;
 * 
 * 注意：本项目使用 fast-xml-parser 进行 OPML 导出，该库会自动转义 XML 实体。
 * 此函数作为备用工具和参考实现保留。不建议在 XMLBuilder 的输出上使用，
 * 以避免双重转义（例如 & → &amp;amp;）。
 */
export function escapeXml(unsafe: string): string {
  if (typeof unsafe !== 'string') {
    return String(unsafe);
  }
  
  return unsafe
    .replace(/&/g, '&amp;')  // 必须首先替换 & 符号
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 测试 XML 转义功能
 */
export function testXmlEscape(): {passed: boolean; errors: string[]} {
  const errors: string[] = [];
  
  const tests = [
    { input: 'Arts & Culture', expected: 'Arts &amp; Culture' },
    { input: 'Text with "quotes"', expected: 'Text with &quot;quotes&quot;' },
    { input: "Text with 'apostrophe'", expected: 'Text with &apos;apostrophe&apos;' },
    { input: 'Less <than>', expected: 'Less &lt;than&gt;' },
    { input: 'Multiple & < > " \' symbols', expected: 'Multiple &amp; &lt; &gt; &quot; &apos; symbols' },
    { input: 'https://example.com/feed?a=1&b=2', expected: 'https://example.com/feed?a=1&amp;b=2' },
    { input: '<script>alert("XSS")</script>', expected: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;' },
  ];
  
  tests.forEach(({ input, expected }) => {
    const result = escapeXml(input);
    if (result !== expected) {
      errors.push(`Failed: "${input}" -> Expected: "${expected}", Got: "${result}"`);
    }
  });
  
  return {
    passed: errors.length === 0,
    errors
  };
}

