
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../../styles/content.css';

interface CKEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function CKEditorComponent({ content, onChange, placeholder, className }: CKEditorProps) {
  return (
    <div className={`border rounded-lg ${className}`}>
      <CKEditor
        // @ts-ignore - CKEditor types are complex and cause issues
        editor={ClassicEditor}
        data={content || ''}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          placeholder: placeholder || 'Type here...',
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'insertTable',
            'mediaEmbed',
            '|',
            'undo',
            'redo'
          ],
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
              { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
          }
        }}
      />
    </div>
  );
}