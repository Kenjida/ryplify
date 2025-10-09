import React, { useMemo, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { fetchWithAuth } from '../utils/api';

// Register the image resize module
Quill.register('modules/imageResize', ImageResize);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const quillRef = useRef<ReactQuill>(null);

  // Custom handler for the image upload button
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      if (!input.files) return;
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      // Use the existing upload endpoint
      fetchWithAuth('/api/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.imageUrl) {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', data.imageUrl);
          }
        }
      })
      .catch(error => {
        console.error('Image upload failed:', error);
        alert('Nahrání obrázku se nezdařilo.');
      });
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'], // 'image' button will trigger our custom handler
        [{ 'align': [] }],
        ['clean']
      ],
      handlers: {
        'image': imageHandler,
      },
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align', // Allow alignment format
    'width', // Allow width style for images
  ];

  return (
    <div className="bg-white text-black rounded-lg">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;