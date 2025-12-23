// // src/editor/Editor.jsx
// // import { EditorContent } from "@tiptap/react";
// // import { useBodyEditor } from "./BodyTiptap";
// // import { useTitleEditor } from "./TitleTiptap";
// // import { useEffect, useRef } from "react";




// // const Editor = ({ page, onBodyChange, onTitleChange }) => {
// // const lastLoadedPageId = useRef(null);
// // // const pageId = page?.id
// // // const pageContent = page?.content
// // // const pageTitle = page?.title
// //   const bodyEditor = useBodyEditor({
// //     onUpdate: onBodyChange,
// //   });

// //   const titleEditor = useTitleEditor(bodyEditor, {
// //     onUpdate: onTitleChange,
// //   });

// //   /* ---------------- LOAD PAGE INTO EDITORS ---------------- */
// //   useEffect(() => {
// //    if (!page || !bodyEditor || !titleEditor) return;
// //   if (lastLoadedPageId.current === page.id) return;

// //     bodyEditor.commands.setContent(
// //       page.content || "",
// //       false
// //     );

// //     titleEditor.commands.setContent(
// //       page.title || "",
// //       false
// //     );
// //     lastLoadedPageId.current = page.id;
// //   }, [page, bodyEditor, titleEditor]); // 👈 ID ONLY (CRITICAL)










// //   return (
// //     <div className="w-full max-w-3xl mx-auto px-10 pt-24 min-h-screen bg-[#fdfcfb] space-y-12">
// //       <EditorContent editor={titleEditor} className="title-editor" />
// //       <EditorContent editor={bodyEditor} className="body-editor" />
// //     </div>
// //   );
// // };

// // export default Editor;
// // src/editor/Editor.jsx
// // import { useEffect, useRef } from "react";
// // import { EditorContent } from "@tiptap/react";
// // import { useBodyEditor } from "./BodyTiptap";
// // import { useTitleEditor } from "./TitleTiptap";


// // // import BubbleMenuUI from "./BubbleMenuUI";


// // const Editor = ({ page, onTitleChange, onContentChange }) => {



 
// //   const bodyEditor = useBodyEditor({
// //     onUpdate: ({ editor }) => {
// //       const json = editor.getJSON();
// //       onContentChange(json);
// //     },
// //   });

// // const titleEditor = useTitleEditor(bodyEditor, {
// //   onUpdate: ({ editor }) => {
// //     const text = editor.getText().trim();

// //     // 🔒 Guard: do nothing for empty text
// //     if (!text) return;

// //     onTitleChange(text);
// //   },
// // });



// //   // 🧠 Prevent overwriting when typing
// //   const lastLoadedPageId = useRef(null);

// //   useEffect(() => {
// //     if (!page || !bodyEditor || !titleEditor) return;

// //     if (lastLoadedPageId.current === page.id) return;

// //     titleEditor.commands.setContent(page.title || "", false);
// //     bodyEditor.commands.setContent(page.content || "", false);

// //     lastLoadedPageId.current = page.id;
// //   }, [page, bodyEditor, titleEditor]);

// //   return (
// //  <div className="w-full max-w-3xl mx-auto px-10 pt-24 min-h-screen bg-[#fdfcfb] space-y-12">
// //      <EditorContent editor={titleEditor} className="title-editor" />
// //      <EditorContent editor={bodyEditor} className="body-editor" />
// //    </div>
// //   );
// // };

// // export default Editor;
// import { useEffect, useRef } from "react";
// import { EditorContent } from "@tiptap/react";
// import { useBodyEditor } from "./BodyTiptap";
// import { useTitleEditor } from "./TitleTiptap";

// const Editor = ({ page, onTitleChange, onContentChange }) => {
//   // ---------------- BODY EDITOR ----------------
//   const bodyEditor = useBodyEditor({
//     onUpdate: ({ editor }) => {
//       onContentChange(editor.getJSON());
//     },
//   });

//   // ---------------- TITLE EDITOR ----------------
//   const titleEditor = useTitleEditor(bodyEditor, {
//     onUpdate: ({ editor }) => {
//       const text = editor.getText();

//       // ⚠️ DO NOT block empty here
//       // Let UI update freely
//       onTitleChange(text);
//     },
//   });

//   // ---------------- LOAD PAGE CONTENT (ONCE PER PAGE) ----------------
//   const lastLoadedPageId = useRef(null);

//   useEffect(() => {
//     if (!page || !bodyEditor || !titleEditor) return;

//     if (lastLoadedPageId.current === page.id) return;

//     titleEditor.commands.setContent(page.title || "", false);
//     bodyEditor.commands.setContent(page.content || "", false);

//     lastLoadedPageId.current = page.id;
//   }, [page.id, bodyEditor, titleEditor, page]);

//   // ---------------- PERSIST TITLE (ON BLUR) ----------------
//   useEffect(() => {
//     if (!titleEditor || !page) return;

//     const handleBlur = () => {
//       const text = titleEditor.getText().trim();

//       onTitleChange(text || "Untitled");
//     };

//     titleEditor.on("blur", handleBlur);

//     return () => {
//       titleEditor.off("blur", handleBlur);
//     };
//   }, [titleEditor, page.id, page, onTitleChange]);

//   return (
//     <div className="w-full max-w-3xl mx-auto px-10 pt-24 min-h-screen bg-[#fdfcfb] space-y-12">
//       <EditorContent editor={titleEditor} className="title-editor" />
//       <EditorContent editor={bodyEditor} className="body-editor" />
//     </div>
//   );
// };

// export default Editor;
import { useEffect, useRef } from "react";
import { EditorContent } from "@tiptap/react";
import { useBodyEditor } from "./BodyTiptap";
import { useTitleEditor } from "./TitleTiptap";

const Editor = ({ page, onTitleChange, onContentChange }) => {
  // ---------------- BODY EDITOR ----------------
  const bodyEditor = useBodyEditor({
    onUpdate: ({ editor }) => {
      onContentChange(editor.getJSON());
    },
  });

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
    <div className="w-full max-w-3xl mx-auto px-10 pt-24 min-h-screen bg-[#fdfcfb] space-y-12">
      <EditorContent editor={titleEditor} className="title-editor" />
      <EditorContent editor={bodyEditor} className="body-editor" />
    </div>
  );
};

export default Editor;