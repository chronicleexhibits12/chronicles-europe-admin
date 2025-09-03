
import { CKEditorComponent } from './ckeditor';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  return (
    <CKEditorComponent 
      content={content} 
      onChange={onChange} 
      placeholder={placeholder} 
      className={className} 
    />
  );
}
