'use client';

import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import TextAlignExtension from '@tiptap/extension-text-align';
import TaskListExtension from '@tiptap/extension-task-list';
import TaskItemExtension from '@tiptap/extension-task-item';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Minus,
  Link2,
  Unlink,
  Image as ImageIcon,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Code2,
  Loader2,
  ChevronDown,
  Sparkles,
  CloudUpload,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = 'Write your article here... Tell a story, share insights, or write code tutorials.',
  minHeight = '380px',
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload an image file to /api/upload (ImageKit CDN or local fallback)
  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload image to ImageKit.');
    }

    return data.url;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-xl bg-slate-900 dark:bg-slate-950 p-4 font-mono text-xs text-orange-300 overflow-x-auto border border-slate-800 my-4 shadow-inner',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-orange-500 pl-4 py-1.5 italic text-slate-700 dark:text-slate-300 my-4 bg-orange-50/50 dark:bg-orange-500/5 rounded-r-xl',
          },
        },
      }),
      UnderlineExtension,
      ImageExtension.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto my-6 border border-slate-200 dark:border-slate-800 shadow-md',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-600 dark:text-orange-400 underline font-semibold hover:text-orange-700 dark:hover:text-orange-300',
        },
      }),
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskListExtension.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2 space-y-2 my-3',
        },
      }),
      TaskItemExtension.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start space-x-2 text-sm',
        },
      }),
      PlaceholderExtension.configure({
        placeholder,
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap ProseMirror w-full focus:outline-none cursor-text',
      },
      // Handle Image Paste from Clipboard directly to ImageKit
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              setIsUploadingImage(true);
              setUploadError(null);

              uploadImageFile(file)
                .then((url) => {
                  if (editor) {
                    editor.chain().focus().setImage({ src: url, alt: file.name }).run();
                  }
                })
                .catch((err) => {
                  setUploadError(err.message || 'Image paste upload failed');
                })
                .finally(() => {
                  setIsUploadingImage(false);
                });

              return true;
            }
          }
        }
        return false;
      },
      // Handle Image Drag-and-Drop from Desktop directly to ImageKit
      handleDrop: (view, event) => {
        const hasFiles = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0;
        if (hasFiles) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            setIsUploadingImage(true);
            setUploadError(null);

            uploadImageFile(file)
              .then((url) => {
                if (editor) {
                  editor.chain().focus().setImage({ src: url, alt: file.name }).run();
                }
              })
              .catch((err) => {
                setUploadError(err.message || 'Image drop upload failed');
              })
              .finally(() => {
                setIsUploadingImage(false);
              });

            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Keep editor content in sync when loaded from external source
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if (editor.getText() === '' && content) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  // Toolbar action: Link Handler
  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter target link URL:', previousUrl || 'https://');

    if (url === null) return;
    if (url === '' || url === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run();
  }, [editor]);

  // Toolbar action: Image upload trigger
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      setIsUploadingImage(true);
      setUploadError(null);
      const url = await uploadImageFile(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Toolbar action: Image from web URL
  const handleInsertImageUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Paste Web Image URL (https://...):');
    if (url && url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  }, [editor]);

  // Words, characters, reading time
  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0, readingTime: 1 };
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTime };
  }, [editor?.getText()]);

  if (!editor) {
    return (
      <div className="w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500 mb-2" />
        <span className="font-medium text-slate-600 dark:text-slate-300">Loading Modern Rich Editor...</span>
      </div>
    );
  }

  // Current block format helper
  const getCurrentFormat = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('heading', { level: 4 })) return 'h4';
    if (editor.isActive('heading', { level: 5 })) return 'h5';
    if (editor.isActive('heading', { level: 6 })) return 'h6';
    return 'p';
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col focus-within:border-orange-500/80 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all overflow-hidden">
      {/* Hidden File Input for Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
      />

      {/* Modern Sleek Toolbar - Docked at Top with Zero Space Gap */}
      <div className="px-3.5 py-2.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md flex flex-wrap items-center gap-1.5">
        
        {/* Headings Selector Dropdown */}
        <div className="relative flex items-center">
          <select
            value={getCurrentFormat()}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'p') editor.chain().focus().setParagraph().run();
              else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
              else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
              else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
              else if (val === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run();
              else if (val === 'h5') editor.chain().focus().toggleHeading({ level: 5 }).run();
              else if (val === 'h6') editor.chain().focus().toggleHeading({ level: 6 }).run();
            }}
            className="pl-3 pr-7 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-orange-500 appearance-none cursor-pointer shadow-xs transition-colors"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1 (H1)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
            <option value="h5">Heading 5 (H5)</option>
            <option value="h6">Heading 6 (H6)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Text Formats (Bold, Italic, Underline, Strike, Code) */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              editor.isActive('bold')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('italic')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('underline')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('strike')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Inline Code"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('code')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Alignment */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            title="Align Left"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Align Center"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Align Right"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Lists & Quotes & Code Block */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            title="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('bulletList')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('orderedList')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Task Checklist"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('taskList')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <ListTodo className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('blockquote')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Code Block"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('codeBlock')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Divider Line"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Media & Links (ImageKit Integration) */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            title="Upload Image directly to ImageKit CDN"
            disabled={isUploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 transition-all flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
          >
            {isUploadingImage ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>Upload Image</span>
          </button>

          <button
            type="button"
            title="Insert Image by Web URL"
            onClick={handleInsertImageUrl}
            className="p-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Insert / Edit Link"
            onClick={handleSetLink}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              editor.isActive('link')
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Link2 className="w-4 h-4" />
          </button>

          {editor.isActive('link') && (
            <button
              type="button"
              title="Remove Link"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-1 ml-auto">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Uploading Notification Banner */}
      {isUploadingImage && (
        <div className="px-4 py-2 bg-orange-500/10 border-b border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs flex items-center space-x-2 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span className="font-medium">Uploading high-resolution image to ImageKit CDN...</span>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="font-bold underline ml-2 hover:text-rose-700 dark:hover:text-rose-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Visual WYSIWYG Content Area */}
      <div
        onClick={() => editor.chain().focus().run()}
        className="relative bg-white dark:bg-slate-900 cursor-text tiptap-container flex flex-col flex-1"
      >
        <EditorContent editor={editor} className="flex-1 w-full" />
      </div>

      {/* Modern SaaS Footer Status Bar */}
      <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-600 dark:text-slate-300">Live WYSIWYG Editor</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-400 dark:text-slate-500">Paste or drag & drop images</span>
        </div>
        <div className="flex items-center space-x-3 font-medium">
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.chars} chars</span>
          <span>•</span>
          <span className="text-orange-600 dark:text-orange-400">{stats.readingTime} min read</span>
        </div>
      </div>
    </div>
  );
}
