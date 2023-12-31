import React, { useState,useRef } from 'react';
import { AtomicBlockUtils, Editor, EditorState, RichUtils,Modifier, Entity,ContentBlock, ContentState, InlineStyle, SelectionState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { getDocument } from 'pdfjs-dist';
import { stateToHTML } from 'draft-js-export-html';
import DocumentInfo from './DocumentInfo';
import Insert from './Insert';
import TextCommands from './TextCommands';
import 'draft-js/dist/Draft.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateEditorState } from '../actions/editorActions';
const Processor = () => {
    const documentInfoRef = useRef();
  const [fontSize, setFontSize] = useState(14);
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor.editorState);
  const [linkInput, setLinkInput] = useState('');
  const [textColor, setTextColor] = useState('black');
  const [isUppercase, setIsUppercase] = useState(false);
   const [textStylesAnchorEl, setTextStylesAnchorEl] = useState(null);

 const [lineSpacing, setLineSpacing] = useState(1.5); 
 const [documentName, setDocumentName] = useState('document');

  const handleDocumentNameChange = (newDocumentName) => {
    setDocumentName(newDocumentName);
  };
 const toggleInlineStyle = (style) => {
  if (style.startsWith('fontSize')) {
    setFontSize(parseInt(style.replace('FONT_SIZE-', ''), 10));
    changeFontSize(fontSize);
  } else if (style.startsWith('COLOR-')) {
    setTextColor(style.replace('COLOR-', ''));
    changeTextColor(textColor);
  } else if (style === 'UPPERCASE') {
    setIsUppercase(!isUppercase);
  } else {
    handleEditorStateChange((prevEditorState) =>
      RichUtils.toggleInlineStyle(prevEditorState, style)
    );
  }
};

const loadPdf = async (file) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    const arrayBuffer = event.target.result;
    const pdfData = new Uint8Array(arrayBuffer);

    try {
      const loadingTask = getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;

      let textContent = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const pageText = await page.getTextContent();
        textContent += pageText.items.map((item) => item.str).join(' ');
      }

      const contentState = ContentState.createFromText(textContent);
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        'insert-characters'
      );
      handleEditorStateChange(newEditorState);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  reader.readAsArrayBuffer(file);
};

const importDocument = (event) => {
const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      loadPdf(file);
    }
};

  const handleTextStylesClose = () => {
    setTextStylesAnchorEl(null);
  };

 
 


const handleFontSizeIncrease = () => {
  if (fontSize < 92) {
    const newFontSize = fontSize + 1;
    changeFontSize(newFontSize);
    setFontSize(newFontSize);
  }
};

const handleFontSizeDecrease = () => {
  if (fontSize > 1) {
    const newFontSize = fontSize - 1;
    changeFontSize(newFontSize);
    setFontSize(newFontSize);
  }
};

const changeTextColor = (newColor) => {
  handleEditorStateChange((prevEditorState) =>
    RichUtils.toggleInlineStyle(prevEditorState, `COLOR-${newColor}`)
  );
};


const changeFontSize = (newFontSize) => {
  
};

   const handleTextStylesClick = (event) => {
    setTextStylesAnchorEl(event.currentTarget);
  };
 
 const handleColor = (event) => {
 setTextColor(event);
 
 }
   

const downloadDocument = () => {
  const contentState = editorState.getCurrentContent();


  const htmlContent = stateToHTML(contentState);

  const pdfElement = document.createElement('div');
  pdfElement.innerHTML = htmlContent;

  html2pdf(pdfElement, {
    margin: 10,
    filename: `${documentName}.pdf`,
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });
};


const blockRenderer = (contentBlock) => {
  const type = contentBlock.getType();

  if (type === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    };
  }

  return null;
};

const AtomicBlock = (props) => {
  const { block, contentState } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));

  const { src, height, width } = entity.getData();

  return <img src={src} alt="Uploaded" style={{ width, height, maxWidth: '100%' }} />;
};

  const handleEditorStateChange = (newEditorState) => {
    dispatch(updateEditorState(newEditorState));
    documentInfoRef.current.countWords();
    documentInfoRef.current.countCharacters();
    documentInfoRef.current.countSelected();
  };
  return (
    <div>
      <span className="activity">
        <input type="file" onChange={importDocument} style={{ display: 'none' }} id="fileInput"  accept=".pdf" />
        <label htmlFor="fileInput">
          <Button component="span" style={{color: 'white'}}>
          <Icon icon="mdi:import" height="30" />
          </Button>
        </label>  
         <Button onClick={downloadDocument} style={{ color: 'white'}}>
          <Icon icon="material-symbols:download" height="30" />
        </Button>
       {/*Insert Images*/}
       <Insert editorState={editorState} handleEditorStateChange={handleEditorStateChange}/> 
       {/*Bold Italicize Underline Strikethrough
       Bullet List, Numbered List, Code Blocks, Quote Blocks
       Clear Formatting
       */}
       <TextCommands editorState={editorState} handleEditorStateChange={handleEditorStateChange}/>



         <Button onClick={handleTextStylesClick}  style ={{color:'white'}}>Text Styles</Button>
        <Menu
          anchorEl={textStylesAnchorEl}
          open={Boolean(textStylesAnchorEl)}
          onClose={handleTextStylesClose}
        >
          <MenuItem>
            Font Size (WIP)
            <Button onClick={handleFontSizeDecrease}>-</Button>
            {fontSize}
            <Button onClick={handleFontSizeIncrease}>+</Button>
          </MenuItem>
          <MenuItem>
            Text Color (WIP)
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColor(e.target.value)}
             />
</MenuItem>
        </Menu>
         {/*Document Naming, Word and Character Count (Document and Selected), Visual Max & Min Word Count Checker */}
      <DocumentInfo  ref={documentInfoRef}  documentName={documentName} onDocumentNameChange={handleDocumentNameChange} editorState={editorState}/>
      
        <Button style={{color:'white'}}>
       <Icon icon= "material-symbols:undo" height="30" />
        </Button>
        <Button style={{color:'white'}}>
        <Icon icon ="material-symbols:redo" height="30"/>
        </Button>
      </span>

      <div className="processor">
        <Editor
          toolbarHidden
          editorState={editorState}
          editorStyle={{ fontSize: `${fontSize}px` }}
          onChange={handleEditorStateChange}
          wrapperClassName="processor-wrapper"
          editorClassName="processor-editor"
          spellCheck={true}
           blockRendererFn={blockRenderer}
        />
      </div>
    </div>
  );
};

export default Processor;
