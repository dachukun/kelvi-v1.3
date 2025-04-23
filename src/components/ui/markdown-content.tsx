import React, { useEffect } from 'react';

// Add MathJax type declaration
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
    };
  }
}

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  useEffect(() => {
    // Trigger MathJax to process the new content
    if (window.MathJax) {
      window.MathJax.typesetPromise?.();
    }
  }, [content]);

  return (
    <div className={`prose prose-sm max-w-full dark:prose-invert markdown-content ${className}`}>
      <div 
        dangerouslySetInnerHTML={{ 
          __html: content
            // Ensure proper spacing around math delimiters
            .replace(/\\\(/g, ' \\( ')
            .replace(/\\\)/g, ' \\) ')
            .replace(/\\\[/g, '\n\\[\n')
            .replace(/\\\]/g, '\n\\]\n')
            // Replace basic markdown with HTML
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
        }} 
        className="whitespace-pre-wrap"
      />
    </div>
  );
} 