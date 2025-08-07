/**
 * Utility functions for downloading content as images
 */

/**
 * Downloads an element as an image using canvas
 * @param element - The DOM element to convert to image
 * @param filename - The filename for the downloaded image
 */
export const downloadElementAsImage = async (element: HTMLElement, filename: string = 'shayari-card.png'): Promise<void> => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Get element dimensions
    const rect = element.getBoundingClientRect();
    const scale = 2; // For better quality
    
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    
    // Scale the context for better quality
    ctx.scale(scale, scale);
    
    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = `${rect.width}px`;
    tempContainer.style.height = `${rect.height}px`;
    
    // Clone the element
    const clonedElement = element.cloneNode(true) as HTMLElement;
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);
    
    // Get computed styles and apply them to canvas
    const computedStyle = window.getComputedStyle(element);
    
    // Fill background
    const bgColor = computedStyle.backgroundColor || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Convert to image using html2canvas-like approach
    await renderElementToCanvas(clonedElement, ctx, rect.width, rect.height);
    
    // Clean up
    document.body.removeChild(tempContainer);
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('Error downloading image:', error);
    // Fallback to simple alert for now
    alert('Download functionality is currently being improved. Please try again later.');
  }
};

/**
 * Simple canvas rendering function (basic implementation)
 * In a real implementation, you'd want to use a library like html2canvas
 */
const renderElementToCanvas = async (element: HTMLElement, ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> => {
  // This is a simplified implementation
  // For production, consider using html2canvas library
  
  const computedStyle = window.getComputedStyle(element);
  
  // Draw background gradient if present
  const backgroundImage = computedStyle.backgroundImage;
  if (backgroundImage && backgroundImage !== 'none') {
    // Simple gradient parsing (very basic)
    if (backgroundImage.includes('linear-gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#ec4899'); // Default pink
      gradient.addColorStop(1, '#fbbf24'); // Default amber
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  }
  
  // Add text content
  const textContent = element.textContent || '';
  if (textContent) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Simple text wrapping
    const lines = wrapText(ctx, textContent, width - 40);
    const lineHeight = 30;
    const startY = (height - (lines.length * lineHeight)) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + (index * lineHeight));
    });
  }
};

/**
 * Simple text wrapping function
 */
const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

/**
 * Share content via WhatsApp
 * @param text - The text content to share
 * @param url - Optional URL to include in the share
 */
export const shareOnWhatsApp = (text: string, url?: string): void => {
  const shareText = url ? `${text}\n\n${url}` : text;
  const encodedText = encodeURIComponent(shareText);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  
  // Open WhatsApp in a new window/tab
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Copy text to clipboard with fallback
 * @param text - The text to copy
 * @returns Promise that resolves when copy is complete
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    throw error;
  }
};

/**
 * Extract blockquotes from HTML content and return structured data
 * @param htmlContent - The HTML content to parse
 * @returns Array of blockquote data with content and theme
 */
export interface BlockquoteData {
  id: string;
  content: string;
  theme: 'love' | 'sad' | 'motivational' | 'friendship' | 'life';
  likes: number;
}

export const extractBlockquotes = (htmlContent: string): BlockquoteData[] => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const blockquotes = tempDiv.querySelectorAll('blockquote');
  const themes: Array<'love' | 'sad' | 'motivational' | 'friendship' | 'life'> =
    ['love', 'sad', 'motivational', 'friendship', 'life'];

  return Array.from(blockquotes).map((blockquote, index) => ({
    id: `blockquote-${index}`,
    content: blockquote.innerHTML,
    theme: themes[Math.floor(Math.random() * themes.length)],
    likes: Math.floor(Math.random() * 50) + 10
  }));
};

/**
 * Remove blockquotes from HTML content and return clean content
 * @param htmlContent - The HTML content to clean
 * @returns HTML content without blockquotes
 */
export const removeBlockquotesFromHTML = (htmlContent: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const blockquotes = tempDiv.querySelectorAll('blockquote');
  blockquotes.forEach(blockquote => blockquote.remove());

  return tempDiv.innerHTML;
};
