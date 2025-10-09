import React, { useRef } from 'react';
import { useEditor, EditorContent, Node } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { fetchWithAuth } from '../utils/api';

// --- Custom Image Extension ---
// This is the key to making alignment work correctly.
// We wrap the image in a div and apply text-align to the div.
const CustomImage = Image.extend({
  name: 'custom-image',
  group: 'block',
  inline: false,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      style: { default: null }, // For resizing
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-wrapper"]',
        getAttrs: (dom) => {
            const img = dom.querySelector('img');
            return {
                src: img?.getAttribute('src'),
                alt: img?.getAttribute('alt'),
                title: img?.getAttribute('title'),
                style: img?.getAttribute('style'),
            }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    // The wrapper div is what gets aligned
    const textAlign = node.attrs.textAlign || 'left';
    return [
      'div',
      { 'data-type': 'image-wrapper', style: `text-align: ${textAlign}` },
      ['img', HTMLAttributes],
    ];
  },
});


interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    fetchWithAuth('/api/upload', { method: 'POST', body: formData })
      .then(response => response.json())
      .then(data => {
        if (data.imageUrl) {
          editor.chain().focus().setImage({ src: data.imageUrl }).run();
        }
      })
      .catch(error => {
        console.error('Image upload failed:', error);
        alert('Nahrání obrázku se nezdařilo.');
      });
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const setImageSize = () => {
    const currentStyle = editor.getAttributes('image').style || '';
    const currentWidthMatch = currentStyle.match(/width:\s*(\d+)/);
    const currentWidth = currentWidthMatch ? currentWidthMatch[1] : 'auto';

    const width = window.prompt('Zadejte novou šířku obrázku v pixelech:', currentWidth);
    
    if (width && !isNaN(Number(width))) {
      editor.chain().focus().updateAttributes('image', { style: `width: ${width}px;` }).run();
    } else if (width) {
      alert('Zadejte prosím platné číslo.');
    }
  };

  return (
    <div className="border border-slate-600 rounded-t-lg p-2 bg-slate-800 flex flex-wrap gap-2 items-center">
      {/* Text formatting */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
      
      {/* Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>Vlevo</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>Na střed</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>Vpravo</button>

      {/* Image */}
      <button type="button" onClick={triggerFileInput}>Přidat obrázek</button>
      {editor.isActive('image') && (
        <button type="button" onClick={setImageSize} className="text-red-400 border border-red-400 px-2 py-1 rounded">
          Změnit velikost
        </button>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage, // Use the fully custom image extension
      TextAlign.configure({
        types: ['heading', 'paragraph', 'custom-image'], // Apply alignment to our custom image wrapper
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none p-4',
      },
    },
  });

  return (
    <div className="border border-slate-600 rounded-lg bg-slate-900 text-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
