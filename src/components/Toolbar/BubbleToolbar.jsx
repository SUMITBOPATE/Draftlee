import {
  Bold, Italic, Underline, Strikethrough,
  Code, Eraser, List, ListOrdered,
  Quote, Heading1, Heading2, Heading3
} from "lucide-react";
import ToolbarButton from "./ToolbarButton";

export default function BubbleToolbar({ editor }) {
  if (!editor) return null;

  // Helper to check activity and set stroke
  const getStroke = (name) => (editor.isActive(name) ? 3 : 2.2);

  return (
    <div className="flex items-center gap-0.5 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--border-light)] px-2 py-1.5 shadow-xl">

      {/* Text Formatting */}
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold size={14} strokeWidth={getStroke("bold")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic size={14} strokeWidth={getStroke("italic")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <Underline size={14} strokeWidth={getStroke("underline")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough size={14} strokeWidth={getStroke("strike")} />
      </ToolbarButton>

      {/* Separator */}
      <div className="w-px h-5 bg-[var(--border-light)] mx-1" />

      {/* Headings */}
      <ToolbarButton
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        <Heading1 size={14} strokeWidth={getStroke("heading")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        <Heading2 size={14} strokeWidth={getStroke("heading")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        <Heading3 size={14} strokeWidth={getStroke("heading")} />
      </ToolbarButton>

      {/* Separator */}
      <div className="w-px h-5 bg-[var(--border-light)] mx-1" />

      {/* Lists & Quotes */}
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List size={14} strokeWidth={getStroke("bulletList")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered size={14} strokeWidth={getStroke("orderedList")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        <Quote size={14} strokeWidth={getStroke("blockquote")} />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
      >
        <Code size={14} strokeWidth={getStroke("codeBlock")} />
      </ToolbarButton>

      {/* Separator */}
      <div className="w-px h-5 bg-[var(--border-light)] mx-1" />

      {/* Inline Code */}
      <ToolbarButton
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline Code"
      >
        <Code size={14} strokeWidth={getStroke("code")} />
      </ToolbarButton>

      {/* Clear Formatting */}
      <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
        <Eraser size={14} strokeWidth={2.2} />
      </ToolbarButton>

    </div>
  );
}