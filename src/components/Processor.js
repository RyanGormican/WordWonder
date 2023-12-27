import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
const Processor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  return (
    <div className="processor">
    <Icon icon="material-symbols:download" />
      <Editor
        editorState={editorState}
       onChange={setEditorState}
      wrapperClassName="processor-wrapper"
        editorClassName="processor-editor"
       />
    </div>
  );
};

export default Processor;
