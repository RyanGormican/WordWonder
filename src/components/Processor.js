import React, { useState, useRef } from 'react';
import { Editor, EditorState, convertToRaw, RichUtils   } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
const Processor = () => {
const editorRef = useRef(null);
const [words,setWords] = useState(0);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const italicizeText = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  } 
  const boldText = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };
    const underlineText = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };
    const countWords = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length;
    setWords(wordCount);
  };

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
    <div>
      <span className="activity">
        <button onClick={italicizeText}>
    <Icon icon="ooui:italic-a" height="30" />
        </button>
          <button onClick={boldText}>
    <Icon icon="ooui:bold-a" height="30" />
    </button>
       <button onClick={underlineText}>
    <Icon icon="majesticons:underline-2" height="30" />
    </button>
    <button onClick={downloadDocument}>
    <Icon icon="material-symbols:download" height="30"/>
    </button>
  {words === 0 || words > 1 ? `${words} words` : `${words} word`}
    </span>
    <div className="processor">
       <Editor
        editorState={editorState}
      onChange={(newEditorState) => {
          setEditorState(newEditorState);
          countWords();
        }}
      wrapperClassName="processor-wrapper"
        editorClassName="processor-editor"
       />
    </div>
    </div>
  );
};

export default Processor;
