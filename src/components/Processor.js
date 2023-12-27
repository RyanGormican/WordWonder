import React, { useState, useRef } from 'react';
import { Editor, EditorState, convertToRaw  } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
const Processor = () => {
const editorRef = useRef(null);
const [words,setWords] = useState(0);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const downloadDocument = () => {
    const plainText = editorState.getCurrentContent().getPlainText();
    const pdfElement = document.createElement('div');
    pdfElement.innerText = plainText;

    html2pdf(pdfElement, {
      margin: 10,
      filename: 'document.pdf',
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  };
  return (
    <div className="processor">
    <span className="activity">
    <button onClick={downloadDocument}>
    <Icon icon="material-symbols:download" height="30"/>
    </button>
    {words > 1 || words == 0 ? (
    {words} words
    ) : ( 
    {words} word
    )}
    </span>
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
