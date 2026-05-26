import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Highlight } from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { FontFamily } from '@tiptap/extension-font-family';
import { Typography } from '@tiptap/extension-typography';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Placeholder } from '@tiptap/extension-placeholder';
import { HighlightAnnotation, UnderlineAnnotation } from './extensions/Annotation';
import FloatingToolbar from '../toolbar/FloatingToolbar';
import { annotationService } from '../../services/annotationService';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  listingId?: string;
  pageId?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  onStatsChange?: (stats: { words: number; characters: number; readingTime: number }) => void;
}

const Editor: React.FC<EditorProps> = ({ 
  content, 
  onChange, 
  listingId,
  pageId,
  readOnly = false, 
  placeholder = 'Start writing...', 
  className = '',
  onStatsChange
}) => {
  const editor = useEditor({
    extensions: [
      HighlightAnnotation,
      UnderlineAnnotation,
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      FontFamily,
      Typography,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      if (onStatsChange) {
        const words = editor.storage.characterCount.words();
        const characters = editor.storage.characterCount.characters();
        const readingTime = Math.ceil(words / 200); // Average 200 wpm
        onStatsChange({ words, characters, readingTime });
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-slate max-w-none focus:outline-none min-h-[500px] ${className}`,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Synchronize dynamic class and editable options reactively on props change
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    // Dynamically update editable status
    editor.setEditable(!readOnly);

    // Dynamically update element attributes class
    editor.setOptions({
      editorProps: {
        attributes: {
          class: `prose prose-slate max-w-none focus:outline-none min-h-[500px] ${className}`,
        },
      },
    });
  }, [editor, readOnly, className]);

  useEffect(() => {
    if (!editor) return;

    const handleFocus = () => {
      (window as any).activePageId = pageId;
    };
    editor.on('focus', handleFocus);

    return () => {
      editor.off('focus', handleFocus);
    };
  }, [editor, pageId]);

  useEffect(() => {
    if (!editor) return;

    const handleGlobalHighlight = (e: Event) => {
      // Direct focus check or last focused pageId fallback
      const isActive = editor.isFocused || (window as any).activePageId === pageId;
      if (!isActive) return;

      const customVal = e as CustomEvent<{ color: string }>;
      const { color } = customVal.detail;
      const { from, to, empty } = editor.state.selection;
      if (!empty) {
        editor.chain().focus().setMark('highlightAnnotation', { color }).run();
        
        // Persist highlights if we have active metadata identifiers
        if (listingId && pageId) {
          const text = editor.state.doc.textBetween(from, to, ' ');
          if (text) {
            annotationService.create({
              listingId,
              pageId,
              annotationType: 'highlight',
              color,
              style: 'solid',
              text,
              startOffset: from,
              endOffset: to,
              selectedRange: `${from}-${to}`
            }).catch(err => console.error('Failed to create annotation on glob-action', err));
          }
        }
      }
    };

    const handleGlobalErase = () => {
      const isActive = editor.isFocused || (window as any).activePageId === pageId;
      if (!isActive) return;

      const { empty } = editor.state.selection;
      if (!empty) {
        editor.chain().focus().unsetMark('highlightAnnotation').unsetMark('underlineAnnotation').run();
      }
    };

    window.addEventListener('editor-global-highlight', handleGlobalHighlight);
    window.addEventListener('editor-global-erase', handleGlobalErase);

    return () => {
      window.removeEventListener('editor-global-highlight', handleGlobalHighlight);
      window.removeEventListener('editor-global-erase', handleGlobalErase);
    };
  }, [editor, listingId, pageId]);

  return (
    <div className="relative w-full h-full">
      {!readOnly && <FloatingToolbar editor={editor} listingId={listingId} pageId={pageId} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
