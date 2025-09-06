import { useState, useEffect } from 'react';
import { CKEditorComponent } from './ckeditor';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  controlled?: boolean; // New prop to control when changes are propagated
}

export function RichTextEditor({ content, onChange, placeholder, className, controlled = false }: RichTextEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  
  // Update local content when the prop content changes (e.g., on save)
  useEffect(() => {
    if (!controlled) {
      setLocalContent(content);
    }
  }, [content, controlled]);
  
  const handleChange = (newContent: string) => {
    if (controlled) {
      // In controlled mode, only update local state
      setLocalContent(newContent);
    } else {
      // In uncontrolled mode, propagate changes immediately
      setLocalContent(newContent);
      onChange(newContent);
    }
  };

  return (
    <CKEditorComponent 
      content={localContent} 
      onChange={handleChange} 
      placeholder={placeholder} 
      className={className} 
    />
  );
}