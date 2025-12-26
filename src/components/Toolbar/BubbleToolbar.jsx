import { 
  Bold, Italic, Underline, Strikethrough, 
  Code, Eraser
} from "lucide-react";
import ToolbarButton from "./ToolbarButton";

export default function BubbleToolbar({ editor }) {
  if (!editor) return null;

  // Helper to check activity and set stroke
  const getStroke = (name) => (editor.isActive(name) ? 3 : 2.2);

  return (
    <div className="flex items-center gap-0.5 bg-white/90 dark:bg-[#2a2520]/95 backdrop-blur-md border border-neutral-200/60 dark:border-[#4a443f]/60 px-2 py-0.2 rounded-full shadow-lg transition-colors duration-300">
      
      <ToolbarButton 
        active={editor.isActive("bold")} 
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={14} strokeWidth={getStroke("bold")} />
      </ToolbarButton>

      <ToolbarButton 
        active={editor.isActive("italic")} 
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={14} strokeWidth={getStroke("italic")} />
      </ToolbarButton>

      <ToolbarButton 
        active={editor.isActive("underline")} 
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={14} strokeWidth={getStroke("underline")} />
      </ToolbarButton>

      <ToolbarButton 
        active={editor.isActive("strike")} 
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={14} strokeWidth={getStroke("strike")} />
      </ToolbarButton>

      <ToolbarButton 
        active={editor.isActive("code")} 
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={14} strokeWidth={getStroke("code")} />
      </ToolbarButton>

  
      <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <Eraser size={14} strokeWidth={2.2} />
      </ToolbarButton>

    
    </div>
  );
}