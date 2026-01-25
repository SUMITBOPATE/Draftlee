
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { EditorContent } from "@tiptap/react";
import { useBodyEditor } from "./BodyTiptap";
import { useTitleEditor } from "./TitleTiptap";
import { BubbleMenu } from '@tiptap/react/menus'
import  BubbleToolbar from "../Toolbar/BubbleToolbar";







const Editor = forwardRef(({ page, onTitleChange, onContentChange, onEditorReady }, ref) => {
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => containerRef.current);






  // ---------------- BODY EDITOR ----------------
   const bodyEditor = useBodyEditor({
        onUpdate: ({ editor }) => {
        onContentChange(editor.getJSON());
    },
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (bodyEditor && onEditorReady) {
      onEditorReady(bodyEditor);
    }
  }, [bodyEditor, onEditorReady]);




  // ---------------- TITLE EDITOR ----------------
  // ✅ FIXED: TitleTiptap passes text directly, not { editor }


  const titleEditor = useTitleEditor(bodyEditor, {
      onUpdate: (text) => {
      // Let UI update freely with whatever the user types
      onTitleChange(text);
    },
  });

  // ---------------- LOAD PAGE CONTENT (ONCE PER PAGE) ----------------
  const lastLoadedPageId = useRef(null);

  useEffect(() => {
    if (!page || !bodyEditor || !titleEditor) return;
    if (lastLoadedPageId.current === page.id) return;

    // Load content without triggering update handlers
    titleEditor.commands.setContent(page.title || "", false);
    bodyEditor.commands.setContent(page.content || "", false);

    bodyEditor.commands.focus("end");

    lastLoadedPageId.current = page.id;
  }, [page?.id, bodyEditor, titleEditor, page]);

  // ---------------- PERSIST TITLE (ON BLUR) ----------------
  useEffect(() => {
    if (!titleEditor || !page) return;

    const handleBlur = () => {
      // Only save if we're still on the same page
      if (page.id !== lastLoadedPageId.current) return;

      const text = titleEditor.getText().trim();
      onTitleChange(text);
    };

    titleEditor.on("blur", handleBlur);

    return () => {
      titleEditor.off("blur", handleBlur);
    };
  }, [titleEditor, page?.id, onTitleChange, page]);

  if (!page) return null;

  return (
  <div ref={containerRef} className="w-full max-w-3xl mx-auto px-8 pt-20 min-h-screen bg-[var(--color-paper)] dark:bg-[var(--color-paper)] text-[var(--color-ink)] space-y-10 transition-colors duration-300">
       <BubbleMenu
        editor={bodyEditor}
         shouldShow={({ editor }) => {
    try {
      if (!editor || editor.isDestroyed) return false;
      const { selection } = editor.state;
      return selection && !selection.empty;
    } catch {
      return false;
    }
  }}
        tippyoptions={{
             duration: 120,
            animation: "shift-away",
            inertia: true,
           maxWidth: "none",
                     }}
       
      >
        <BubbleToolbar editor={bodyEditor} />
      </BubbleMenu>


<EditorContent editor={titleEditor} className="title-editor" />
<EditorContent editor={bodyEditor} className="body-editor" />

    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;