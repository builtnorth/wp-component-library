/**
 * AI Framework Utilities
 * 
 * Helper functions for content extraction and processing
 */

/**
 * Extract headings from HTML content
 * @param {string} content - HTML content
 * @param {Array} levels - Heading levels to extract (e.g., ['h2', 'h3'])
 * @returns {Array} Array of heading texts
 */
export function extractHeadings(content, levels = ['h2', 'h3']) {
    if (!content) return [];
    
    const headings = [];
    const pattern = new RegExp(`<(${levels.join('|')})[^>]*>(.*?)</\\1>`, 'gi');
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
        const text = match[2].replace(/<[^>]*>/g, '').trim();
        if (text) {
            headings.push(text);
        }
    }
    
    return headings;
}

/**
 * Extract list items from HTML content
 * @param {string} content - HTML content
 * @param {number} maxItems - Maximum items to extract
 * @returns {Array} Array of list item texts
 */
export function extractListItems(content, maxItems = 5) {
    if (!content) return [];
    
    const items = [];
    const pattern = /<li[^>]*>(.*?)<\/li>/gi;
    let match;
    
    while ((match = pattern.exec(content)) !== null && items.length < maxItems) {
        const text = match[1].replace(/<[^>]*>/g, '').trim();
        if (text && text.length > 10) {
            items.push(text.substring(0, 100));
        }
    }
    
    return items;
}

/**
 * Extract first paragraph from HTML content
 * @param {string} content - HTML content
 * @param {number} maxLength - Maximum length to extract
 * @returns {string} First paragraph text
 */
export function extractFirstParagraph(content, maxLength = 200) {
    if (!content) return '';
    
    const match = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (match) {
        const text = match[1].replace(/<[^>]*>/g, '').trim();
        return text.substring(0, maxLength);
    }
    
    return '';
}

/**
 * Extract paragraphs from HTML content
 * @param {string} content - HTML content
 * @param {number} maxParagraphs - Maximum number of paragraphs to extract
 * @returns {Array} Array of paragraph texts
 */
/**
 * Extract paragraphs from content
 */
export function extractParagraphs(content, maxParagraphs = 3) {
    if (!content) return [];
    
    const paragraphs = [];
    const matches = content.matchAll(/<p[^>]*>(.*?)<\/p>/gi);
    
    let count = 0;
    for (const match of matches) {
        if (count >= maxParagraphs) break;
        const text = match[1].replace(/<[^>]*>/g, '').trim();
        if (text && text.length > 20) { // Filter out very short paragraphs
            paragraphs.push(text);
            count++;
        }
    }
    
    return paragraphs;
}

/**
 * Extract structured content from HTML
 * @param {string} content - HTML content
 * @param {Object} options - Extraction options
 * @returns {Object} Extracted content
 */
export function extractStructuredContent(content, options = {}) {
    const {
        includeHeadings = true,
        includeLists = true,
        includeFirstParagraph = true,
        headingLevels = ['h2', 'h3'],
        maxListItems = 5,
        maxParagraphLength = 200
    } = options;
    
    const extracted = {};
    
    if (includeHeadings) {
        extracted.headings = extractHeadings(content, headingLevels);
    }
    
    if (includeLists) {
        extracted.listItems = extractListItems(content, maxListItems);
    }
    
    if (includeFirstParagraph) {
        extracted.firstParagraph = extractFirstParagraph(content, maxParagraphLength);
    }
    
    return extracted;
}

/**
 * Clean and sanitize AI output
 * @param {string} text - AI generated text
 * @param {Object} options - Cleaning options
 * @returns {string} Cleaned text
 */
export function cleanAIOutput(text, options = {}) {
    const {
        trimQuotes = true,
        removeMetadata = true,
        ensureSentenceEnd = true
    } = options;
    
    let cleaned = text.trim();
    
    // Remove surrounding quotes
    if (trimQuotes) {
        cleaned = cleaned.replace(/^["']|["']$/g, '');
    }
    
    // Remove common metadata patterns
    if (removeMetadata) {
        // Remove character count indicators
        cleaned = cleaned.replace(/[\-–—]\s*\d+\s*character.*/gi, '');
        cleaned = cleaned.replace(/\(\d+\s*character.*\)/gi, '');
        
        // Remove instruction remnants
        cleaned = cleaned.replace(/^(meta\s*description\s*:?\s*)/i, '');
        cleaned = cleaned.replace(/^(title\s*:?\s*)/i, '');
        
        // Remove bracketed metadata
        cleaned = cleaned.replace(/\[.*?\]/g, '');
    }
    
    // Ensure ends with punctuation
    if (ensureSentenceEnd && cleaned.length > 0) {
        const lastChar = cleaned[cleaned.length - 1];
        if (!/[.!?]/.test(lastChar)) {
            cleaned += '.';
        }
    }
    
    return cleaned.trim();
}

/**
 * Truncate text to last complete sentence within limit
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateToSentence(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    
    // Try to find the last sentence that fits
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let result = '';
    
    for (const sentence of sentences) {
        if ((result + sentence).length <= maxLength) {
            result += sentence;
        } else {
            break;
        }
    }
    
    // If we got something reasonable, return it
    if (result.length >= maxLength * 0.5) {
        return result.trim();
    }
    
    // Otherwise, hard truncate and add ellipsis
    return text.substring(0, maxLength - 3) + '...';
}