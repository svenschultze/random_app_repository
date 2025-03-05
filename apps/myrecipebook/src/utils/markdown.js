/**
 * Simple markdown parser to convert markdown to HTML
 * Handles headings, lists, bold, italic, and paragraphs
 */
export function renderMarkdown(markdown) {
  if (!markdown) return '';

  // Process line by line
  const lines = markdown.split('\n');
  let inList = false;
  let inCodeBlock = false;
  let html = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines
    if (line === '') {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      html += `<h1>${line.substring(2)}</h1>\n`;
    } else if (line.startsWith('## ')) {
      html += `<h2>${line.substring(3)}</h2>\n`;
    } else if (line.startsWith('### ')) {
      html += `<h3>${line.substring(4)}</h3>\n`;
    } else if (line.startsWith('#### ')) {
      html += `<h4>${line.substring(5)}</h4>\n`;
    } else if (line.startsWith('##### ')) {
      html += `<h5>${line.substring(6)}</h5>\n`;
    } else if (line.startsWith('###### ')) {
      html += `<h6>${line.substring(7)}</h6>\n`;
    }
    // Lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += '<ul>\n';
        inList = true;
      }
      html += `<li>${formatInline(line.substring(2))}</li>\n`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        html += '<ol>\n';
        inList = true;
      }
      const content = line.replace(/^\d+\.\s/, '');
      html += `<li>${formatInline(content)}</li>\n`;
    }
    // Code blocks
    else if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += '</code></pre>\n';
        inCodeBlock = false;
      } else {
        html += '<pre><code>';
        inCodeBlock = true;
      }
    }
    // Regular paragraph
    else {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += `<p>${formatInline(line)}</p>\n`;
    }
  }

  // Close any open lists
  if (inList) {
    html += '</ul>\n';
  }

  return html;
}

/**
 * Format inline markdown (bold, italic, code)
 */
function formatInline(text) {
  // Bold: **text** or __text__
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Italic: *text* or _text_
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Code: `code`
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');
  
  return text;
}