// Extract text from Tiptap JSON content
export function getTextFromContent(content) {
  if (!content) return "";
  if (typeof content === "string") return content;

  if (typeof content === "object" && content.content) {
    return extractTextFromNodes(content.content);
  }

  return "";
}

function extractTextFromNodes(nodes) {
  if (!Array.isArray(nodes)) return "";

  return nodes
    .map((node) => {
      // Text node
      if (node.type === "text") {
        return node.text || "";
      }

      // Paragraph, heading, blockquote, etc.
      if (node.content && Array.isArray(node.content)) {
        return extractTextFromNodes(node.content);
      }

      // Horizontal rule, break
      if (node.type === "horizontalRule" || node.type === "hardBreak") {
        return "\n";
      }

      return "";
    })
    .join(nodeSeparator(nodes));
}

function nodeSeparator(nodes) {
  // Add space/newline between block-level elements
  if (nodes.length > 1) {
    return " ";
  }
  return "";
}

// Check if content contains text (case-insensitive)
export function contentContainsText(content, searchText) {
  const text = getTextFromContent(content).toLowerCase();
  return text.includes(searchText.toLowerCase());
}

// Count occurrences of text in content
export function countTextOccurrences(content, searchText) {
  const text = getTextFromContent(content).toLowerCase();
  const query = searchText.toLowerCase();

  if (!query) return 0;

  let count = 0;
  let position = 0;
  while ((position = text.indexOf(query, position)) !== -1) {
    count++;
    position += query.length;
  }

  return count;
}
