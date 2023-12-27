import React, { useState, useRef } from 'react';
import { Editor, EditorState, RichUtils   } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const Processor = () => {
const editorRef = useRef(null);
const [words,setWords] = useState(0);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [textCommandAnchorEl, setTextCommandAnchorEl] = useState(null);
  const changeState = (state) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, state));
  } 
 
    const countWords = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length;
    setWords(wordCount);
  };
   const handleTextCommandClick = (event) => {
    setTextCommandAnchorEl(event.currentTarget);
  };

  const handleTextCommandClose = () => {
    setTextCommandAnchorEl(null);
  };

  const handleTextCommandSelect = (state) => {
    changeState(state);
    handleTextCommandClose();
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
  <Button onClick={handleTextCommandClick}>Text Commands</Button>
  <Menu
    anchorEl={textCommandAnchorEl}
    open={Boolean(textCommandAnchorEl)}
    onClose={handleTextCommandClose}
  >
    <MenuItem onClick={() => handleTextCommandSelect('ITALIC')}>Italicize  <Icon icon="ooui:italic-a" height="20" /> </MenuItem>
    <MenuItem onClick={() => handleTextCommandSelect('BOLD')}>Bold  <Icon icon="ooui:bold-a" height="20" /></MenuItem>
    <MenuItem onClick={() => handleTextCommandSelect('UNDERLINE')}>Underline   <Icon icon="majesticons:underline-2" height="20" /></MenuItem>
    <MenuItem onClick={() => handleTextCommandSelect('STRIKETHROUGH')}>Strikthrough   <Icon icon="ooui:strikethrough-a" height="20" /></MenuItem>
    <MenuItem onClick={() => handleTextCommandSelect('SUPSCRIPT')}>Subscript   <Icon icon="bi:subscript" height="20" /></MenuItem>
    <MenuItem onClick={() => handleTextCommandSelect('SUPERSCRIPT')}>Superscript   <Icon icon="bi:superscript" height="20" /></MenuItem>
  </Menu>

  <button onClick={downloadDocument}>
    <Icon icon="material-symbols:download" height="30" />
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
