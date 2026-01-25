
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark, mergeAttributes, Extension } from '@tiptap/core';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Heading from '@tiptap/extension-heading';

const FontFamilyMark = Mark.create({
  name: 'fontFamily',
  addAttributes() {
    return {
      fontFamily: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[style*="font-family"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { fontFamily, ...rest } = HTMLAttributes;
    return ['span', mergeAttributes(rest, { style: fontFamily ? `font-family: ${fontFamily}` : '' }), 0];
  },
});

export function useBodyEditor({onUpdate}) {
  return useEditor({
    extensions: [
      StarterKit,
      FontFamilyMark,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc list-inside ml-4',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal list-inside ml-4',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-[#8b7355] dark:border-[#c5a059] pl-4 italic my-4 text-neutral-600 dark:text-neutral-400',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 font-mono text-sm my-4 overflow-x-auto',
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
      content: "",
    onUpdate,
  });
}
