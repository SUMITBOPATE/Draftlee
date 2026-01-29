
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from '@tiptap/extensions/placeholder'

export function useTitleEditor(bodyEditor, { onUpdate } = {}) {
  const editor = useEditor({
    content: "",
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder: "Untitled",
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-editor-empty",
      }),
    ],
    editorProps: {
      handleKeyDown(_, event) {
        if (event.key === "Enter") {
          event.preventDefault();
          bodyEditor?.commands.focus("start");
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      // Only call onUpdate if there's actual content change
      const text = editor.getText().trim();
      onUpdate?.(text);
    },
  });

  return editor;
}