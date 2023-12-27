import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Processor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  return (
    <div className="processor">
      <Editor
      className="processor"
        editorState={editorState}
       onChange={setEditorState}
      />
    </div>
  );
};

export default Processor;
