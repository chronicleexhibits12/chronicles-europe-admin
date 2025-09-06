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
    if (controlled) {
      setLocalContent(content);
    }
  }, [content, controlled]);
  
  const handleChange = (newContent: string) => {
    // In controlled mode, we still need to call onChange to propagate changes
    // In uncontrolled mode, we also call onChange
    onChange(newContent);
    
    // Only update local state in controlled mode
    if (controlled) {
      setLocalContent(newContent);
    }
  };

  return (
    <CKEditorComponent 
      content={controlled ? localContent : content} 
      onChange={handleChange} 
      placeholder={placeholder} 
      className={className} 
    />
  );
}