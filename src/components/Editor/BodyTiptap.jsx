// src/editor/BodyTiptap.js
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import { Placeholder } from '@tiptap/extensions/placeholder'
import { Placeholder} from '@tiptap/extensions'

export function useBodyEditor({onUpdate}) {
  return useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something…...",
        emptyEditorClass: "is-editor-empty",
      }),



    ], 
      content: "",
    onUpdate,
  });
}
