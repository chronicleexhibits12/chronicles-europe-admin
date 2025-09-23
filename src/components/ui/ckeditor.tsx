import { useRef, useEffect, useId, useState } from "react";
import "../../styles/content.css";

interface CKEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

// Global state to track script loading
let isScriptLoading = false;
let isScriptLoaded = false;
const scriptCallbacks: (() => void)[] = [];

const loadCKEditorScript = (callback: () => void) => {
  const scriptUrl = "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js";

  if (isScriptLoaded) {
    callback();
    return;
  }

  scriptCallbacks.push(callback);

  if (isScriptLoading) {
    return; // Script is already loading
  }

  const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
  if (existingScript) {
    isScriptLoaded = true;
    scriptCallbacks.forEach((cb) => cb());
    scriptCallbacks.length = 0;
    return;
  }

  isScriptLoading = true;
  const script = document.createElement("script");
  script.src = scriptUrl;
  script.async = true;
  script.onload = () => {
    isScriptLoaded = true;
    isScriptLoading = false;
    scriptCallbacks.forEach((cb) => cb());
    scriptCallbacks.length = 0;
  };
  script.onerror = () => {
    isScriptLoading = false;
    console.error("Failed to load CKEditor script");
  };
  document.body.appendChild(script);
};

export function CKEditorComponent({
  content,
  onChange,
  placeholder,
  className,
}: CKEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const uniqueId = useId();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const contentRef = useRef(content);

  // Keep content ref updated
  contentRef.current = content;

  useEffect(() => {
    let isMounted = true;

    const initEditor = () => {
      if (!isMounted || !window.CKEDITOR || !textareaRef.current) {
        return;
      }

      // Clean up existing instance
      if (editorRef.current) {
        editorRef.current.destroy(true);
        editorRef.current = null;
      }

      if (window.CKEDITOR.instances[uniqueId]) {
        window.CKEDITOR.instances[uniqueId].destroy(true);
      }

      try {
        const editor = window.CKEDITOR.replace(uniqueId, {
          format_tags: "p;h1;h2;h3;h4;h5;h6;pre;address;div",
          startupFocus: false,
        });

        editorRef.current = editor;

        editor.on("instanceReady", () => {
          if (!isMounted) return;

          setIsEditorReady(true);

          // Set initial content after editor is ready
          if (contentRef.current && editor.getData() !== contentRef.current) {
            editor.setData(contentRef.current);
          }
        });

        editor.on("change", () => {
          if (!isMounted) return;
          const data = editor.getData();
          onChange(data);
        });

        // Also listen for key events for more responsive updates
        editor.on("key", () => {
          setTimeout(() => {
            if (!isMounted) return;
            const data = editor.getData();
            onChange(data);
          }, 0);
        });
      } catch (error) {
        console.error("Failed to initialize CKEditor:", error);
      }
    };

    loadCKEditorScript(initEditor);

    return () => {
      isMounted = false;
      setIsEditorReady(false);

      if (editorRef.current) {
        try {
          editorRef.current.destroy(true);
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
        editorRef.current = null;
      }

      if (window.CKEDITOR?.instances[uniqueId]) {
        try {
          window.CKEDITOR.instances[uniqueId].destroy(true);
        } catch (error) {
          console.error("Error destroying CKEDITOR instance:", error);
        }
      }
    };
  }, [uniqueId]);

  // Sync content when it changes from parent
  useEffect(() => {
    if (
      isEditorReady &&
      editorRef.current &&
      content !== editorRef.current.getData()
    ) {
      // Use setTimeout to avoid conflicts with editor's internal operations
      setTimeout(() => {
        if (editorRef.current && content !== editorRef.current.getData()) {
          editorRef.current.setData(content);
        }
      }, 0);
    }
  }, [content, isEditorReady]);

  return (
    <div>
      <textarea
        ref={textareaRef}
        id={uniqueId}
        name={uniqueId}
        className={`border rounded-lg ${className}`}
        placeholder={placeholder}
        defaultValue={content} // Fallback content while editor loads
        style={{
          minHeight: "200px",
          display: isEditorReady ? "none" : "block", // Hide textarea once editor is ready
        }}
      />
    </div>
  );
}
