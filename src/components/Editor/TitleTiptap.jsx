
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from '@tiptap/extensions/placeholder'

export function useTitleEditor(bodyEditor, { onUpdate } = {}) {
  return useEditor({
    content: " ",
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        hardBreak: false, // Prevent line breaks in title
      }),
      Placeholder.configure({
        placeholder: "Untitled",
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-editor-empty",
      }),
    ],
    editorProps: {
      handleKeyDown(_, event) {
        // On Enter, move focus to body editor
        if (event.key === "Enter") {
          event.preventDefault();
          bodyEditor?.commands.focus("start");
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      const text = editor.getText();
      
      // Call onUpdate with the current text (can be empty)
      // The parent component decides what to do with it
      onUpdate?.(text);
    },
  });
}