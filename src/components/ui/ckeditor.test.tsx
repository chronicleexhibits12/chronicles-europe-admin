import { useState } from 'react';
import { RichTextEditor } from './rich-text-editor';

export function CKEditorTest() {
  const [content, setContent] = useState('<p>Hello, world!</p>');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CKEditor Test</h1>
      <div className="mb-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Enter some text..."
        />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Output:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}