// src/editor/BubbleMenuUI.jsx
import { BubbleMenu } from '@tiptap/extension-bubble-menu'

const BubbleMenuUI = ({ editor }) => {
  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="flex gap-1 rounded-md border bg-white shadow px-1 py-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
        >
          U
        </button>
      </div>
    </BubbleMenu>
  );
};

export default BubbleMenuUI;