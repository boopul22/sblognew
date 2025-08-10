import React from 'react';
import BlockquoteCard from '../components/BlockquoteCard';

interface ParsedContent {
    type: 'html' | 'blockquote';
    content: string;
    author?: string;
    index?: number;
}

/**
 * Server-side regex-based parsing for blockquotes
 */
function parseContentWithRegex(htmlContent: string): ParsedContent[] {
    const result: ParsedContent[] = [];
    let blockquoteIndex = 0;

    // Split content by blockquote tags
    const blockquoteRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
    let lastIndex = 0;
    let match;

    while ((match = blockquoteRegex.exec(htmlContent)) !== null) {
        // Add HTML content before this blockquote
        const htmlBefore = htmlContent.slice(lastIndex, match.index).trim();
        if (htmlBefore) {
            result.push({
                type: 'html',
                content: htmlBefore
            });
        }

        // Extract blockquote content preserving line breaks
        let blockquoteContent = match[1]
            .replace(/<br\s*\/?>/gi, '\n') // Convert <br> tags to line breaks
            .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n') // Convert paragraph breaks
            .replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
            .replace(/<\/p>/gi, '\n') // Convert closing </p> to line break
            .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Normalize multiple line breaks
            .trim();

        let content = blockquoteContent;
        let author = '';

        // Check if there's an author attribution (usually starts with "- ")
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1].trim();
            if (lastLine.startsWith('- ')) {
                author = lastLine.substring(2).trim();
                content = lines.slice(0, -1).join('\n').trim();
            }
        }

        // Add blockquote to result
        result.push({
            type: 'blockquote',
            content,
            author: author || undefined,
            index: blockquoteIndex++
        });

        lastIndex = blockquoteRegex.lastIndex;
    }

    // Add remaining HTML content
    const htmlAfter = htmlContent.slice(lastIndex).trim();
    if (htmlAfter) {
        result.push({
            type: 'html',
            content: htmlAfter
        });
    }

    return result;
}

/**
 * Parses HTML content and extracts blockquotes for special rendering
 */
export function parseContentWithBlockquotes(htmlContent: string): ParsedContent[] {
    if (!htmlContent) return [];

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        // Server-side: Use regex-based parsing as fallback
        return parseContentWithRegex(htmlContent);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const body = doc.body;
    
    const result: ParsedContent[] = [];
    let blockquoteIndex = 0;
    
    // Process all child nodes
    const processNode = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            if (element.tagName.toLowerCase() === 'blockquote') {
                // Extract blockquote content preserving line breaks
                let blockquoteContent = element.innerHTML || '';

                // Convert HTML line breaks to actual line breaks
                blockquoteContent = blockquoteContent
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
                    .replace(/<p[^>]*>/gi, '')
                    .replace(/<\/p>/gi, '\n')
                    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/\n\s*\n\s*\n/g, '\n\n') // Normalize multiple line breaks
                    .trim();

                let content = blockquoteContent;
                let author = '';

                // Check if there's an author attribution (usually starts with "- ")
                const lines = content.split('\n').filter(line => line.trim());
                if (lines.length > 1) {
                    const lastLine = lines[lines.length - 1].trim();
                    if (lastLine.startsWith('- ')) {
                        author = lastLine.substring(2).trim();
                        content = lines.slice(0, -1).join('\n').trim();
                    }
                }
                
                // Add blockquote to result
                result.push({
                    type: 'blockquote',
                    content,
                    author: author || undefined,
                    index: blockquoteIndex++
                });
                
                // Return placeholder for this blockquote
                return `__BLOCKQUOTE_PLACEHOLDER_${blockquoteIndex - 1}__`;
            }
            
            // For other elements, process children and reconstruct
            let innerHTML = '';
            for (let i = 0; i < element.childNodes.length; i++) {
                innerHTML += processNode(element.childNodes[i]);
            }
            
            // Reconstruct the element with processed content
            const attributes = Array.from(element.attributes)
                .map(attr => `${attr.name}="${attr.value}"`)
                .join(' ');
            
            return `<${element.tagName.toLowerCase()}${attributes ? ' ' + attributes : ''}>${innerHTML}</${element.tagName.toLowerCase()}>`;
        }
        
        return '';
    };
    
    // Process the entire body content
    let processedHtml = '';
    for (let i = 0; i < body.childNodes.length; i++) {
        processedHtml += processNode(body.childNodes[i]);
    }
    
    // Split the processed HTML by blockquote placeholders
    const parts = processedHtml.split(/__BLOCKQUOTE_PLACEHOLDER_(\d+)__/);
    
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            // HTML content
            const htmlPart = parts[i].trim();
            if (htmlPart) {
                result.splice(Math.floor(i / 2) * 2, 0, {
                    type: 'html',
                    content: htmlPart
                });
            }
        }
        // Odd indices are blockquote placeholder numbers, already handled
    }
    
    return result;
}

/**
 * Renders parsed content with BlockquoteCard components
 */
export function renderParsedContent(parsedContent: ParsedContent[]): React.ReactNode[] {
    return parsedContent.map((item, index) => {
        if (item.type === 'blockquote') {
            return (
                <BlockquoteCard
                    key={`blockquote-${item.index}-${index}`}
                    content={item.content}
                    author={item.author}
                    index={item.index || 0}
                />
            );
        } else {
            return (
                <div
                    key={`html-${index}`}
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                />
            );
        }
    });
}
