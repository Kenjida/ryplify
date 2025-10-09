import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor CSS
import { fetchWithAuth } from '../utils/api';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {

  const handleImageUploadBefore = (files: File[], info: object, uploadHandler: (response: any) => void) => {
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
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
        const response = {
          result: [
            {
              url: data.imageUrl,
              name: file.name,
              size: file.size,
            },
          ],
        };
        // Pass the result to the editor's upload handler
        uploadHandler(response);
      }
    })
    .catch(error => {
      console.error('Image upload failed:', error);
      alert('Nahrání obrázku se nezdařilo.');
      uploadHandler(null); // Tell the editor the upload failed
    });

    // Return false to prevent the default upload behavior
    return false;
  };

  return (
    <SunEditor
      setContents={content}
      onChange={onChange}
      onImageUploadBefore={handleImageUploadBefore}
      setOptions={{
        height: '400px',
        buttonList: [
          ['undo', 'redo'],
          ['font', 'fontSize', 'formatBlock'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['removeFormat'],
          '/', // Line break
          ['fontColor', 'hiliteColor'],
          ['outdent', 'indent'],
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
      
      {/* Image */}
      <button type="button" onClick={triggerFileInput}>Přidat obrázek</button>
      {editor.isActive('image') && (
        <button type="button" onClick={setImageSize} className="text-red-400 border border-red-400 px-2 py-1 rounded">
          Změnit velikost
        </button>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
    </div>
          ['table', 'link', 'image'], // 'image' button will now use our handler
          ['fullScreen', 'showBlocks', 'codeView'],
          ['preview', 'print'],
        ],
        imageResizing: true,
        imageWidth: 'auto',
      }}
    />
  );
};

export default RichTextEditor;
