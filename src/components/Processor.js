import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Processor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  return (
    <div className="processor"={{ height: '50vh', width: '50vw' }}>
      <Editor
        editorState={editorState}
       onChange={setEditorState}
      />
    </div>
  );
};

export default Processor;
