import { jsPDF } from 'jspdf';

/**
 * Convert any CSS color to hex RGB
 */
function colorToHex(color) {
  if (!color || color === 'transparent') return '#000000';

  // Handle named colors
  const namedColors = {
    black: '#000000',
    dark: '#1a1613',
    '#1a1613': '#1a1613',
  };

  if (namedColors[color]) return namedColors[color];

  // If it's already hex
  if (color.startsWith('#')) {
    return color.length === 4 ? '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] : color;
  }

  // If it's rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  // Default to black for oklch and other unsupported formats
  return '#000000';
}

/**
 * Export editor content as PDF
 * @param {HTMLElement} element - The HTML element to export
 * @param {string} fileName - The output filename (without extension)
 */
export async function exportToPDF(element, fileName = 'document') {
  if (!element) {
    throw new Error('Editor element not found');
  }

  // Get all text content from the editor
  const titleEl = element.querySelector('.title-editor .tiptap');
  const bodyEl = element.querySelector('.body-editor .tiptap');

  // Extract text from title
  const titleText = titleEl ? titleEl.innerText.trim() : '';
  const bodyText = bodyEl ? bodyEl.innerText.trim() : '';

  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 7; // mm
  const fontSizePt = 12; // points

  // Set font
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSizePt);
  // Use hardcoded black for PDF - clean and professional
  pdf.setTextColor(0, 0, 0);

  let y = margin;

  // Add title if exists
  if (titleText) {
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(titleText, contentWidth);

    // Check if title needs new page
    if (y + (titleLines.length * 10) > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }

    pdf.text(titleLines, margin, y);
    y += (titleLines.length * 10) + 10;
  }

  // Add body text
  pdf.setFontSize(fontSizePt);
  pdf.setFont('helvetica', 'normal');

  // Split text into lines that fit the page
  const allText = bodyText.split('\n\n').filter(p => p.trim());
  const paragraphs = [];

  for (const para of allText) {
    const lines = pdf.splitTextToSize(para, contentWidth);
    paragraphs.push(...lines, ''); // Add empty line between paragraphs
  }

  // Remove last empty line
  if (paragraphs.length > 0 && paragraphs[paragraphs.length - 1] === '') {
    paragraphs.pop();
  }

  // Add paragraphs to PDF
  for (const line of paragraphs) {
    if (y + lineHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += lineHeight;
  }

  // Save the PDF
  pdf.save(`${fileName}.pdf`);

  return true;
}
