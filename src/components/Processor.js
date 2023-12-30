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
import 'draft-js/dist/Draft.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateEditorState } from '../actions/editorActions';
const Processor = () => {
    const documentInfoRef = useRef();
    const [textBlockingMenuAnchorEl, setTextBlockingMenuAnchorEl] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor.editorState);
  const [linkInput, setLinkInput] = useState('');
  const [textColor, setTextColor] = useState('black');
  const [isUppercase, setIsUppercase] = useState(false);
   const [textFormattingMenuAnchorEl, setTextFormattingMenuAnchorEl] = useState(null);
  const [textCommandAnchorEl, setTextCommandAnchorEl] = useState(null);
   const [textStylesAnchorEl, setTextStylesAnchorEl] = useState(null);
   const [insertCommandAnchorE1, setInsertCommandAnchorEl] =useState(null);
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
const handleInsertComandClose = () => {
setInsertCommandAnchorEl(null);
}
const handleTextCommandClose = () => {
    setTextCommandAnchorEl(null);
    setTextFormattingMenuAnchorEl(null);
    setTextStylesAnchorEl(null);
    setTextBlockingMenuAnchorEl(null);
  };

  const handleTextFormattingMenuClose = () => {
    setTextFormattingMenuAnchorEl(null);
  };

  const handleTextStylesClose = () => {
    setTextStylesAnchorEl(null);
  };

 
  const handleTextBlockingMenuClick = (event) => {
  setTextBlockingMenuAnchorEl(event.currentTarget);
};

const handleTextBlockingMenuClose = () => {
  setTextBlockingMenuAnchorEl(null);
};

const handleTextCommandSelect = (style) => {
  if (style === 'TEXT_FORMATTING') {
    handleTextFormattingMenuClick();
  } else if (style === 'DOCUMENT_INFORMATION') {
  
  } else if (style === 'UPPERCASE') {
    convertToUppercase();
  } else {
    toggleInlineStyle(style);
  }
};

  const handleInsertCommandClick = (event) => {
    setInsertCommandAnchorEl(event.currentTarget);
  };
  const handleTextCommandClick = (event) => {
    setTextCommandAnchorEl(event.currentTarget);
  };


  const handleTextFormattingMenuClick = (event) => {
    setTextFormattingMenuAnchorEl(event.currentTarget);
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
const convertToUppercase = () => {
  const selection = editorState.getSelection();

  const contentState = editorState.getCurrentContent();

  const selectedText = contentState
    .getBlockForKey(selection.getStartKey())
    .getText()
    .slice(selection.getStartOffset(), selection.getEndOffset());


  const uppercaseText = selectedText.toUpperCase();

  const newContentState = Modifier.replaceText(
    contentState,
    selection,
    uppercaseText
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'replace-text'
  );

  handleEditorStateChange(newEditorState);
};

const changeFontSize = (newFontSize) => {
  
};

   const handleTextStylesClick = (event) => {
    setTextStylesAnchorEl(event.currentTarget);
  };
 
 const handleColor = (event) => {
 setTextColor(event);
 
 }
 
 const handleBulletList = () => {
  handleEditorStateChange(RichUtils.toggleBlockType(editorState, 'unordered-list-item'));
};
const handleNumberList = () => {
  handleEditorStateChange(RichUtils.toggleBlockType(editorState, 'ordered-list-item'));
};
const handleCodeBlock = () => {
handleEditorStateChange(RichUtils.toggleBlockType(editorState, 'code-block'));
}
const handleQuoteBlock = () => {
  handleEditorStateChange(RichUtils.toggleBlockType(editorState, 'blockquote'));
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
const handleImageUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          'image',
          'IMMUTABLE',
          { src: reader.result, height: img.height, width: img.width }
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
          editorState,
          { currentContent: contentStateWithEntity },
          'create-entity'
        );

        handleEditorStateChange(
          AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
        );
      };
    };

    reader.readAsDataURL(file);
  }
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
        <Button onClick={handleInsertCommandClick}  style ={{color:'white'}}>Insert</Button>
<Menu
 anchorEl={insertCommandAnchorE1}
 open={Boolean(insertCommandAnchorE1)}
 onClose={handleInsertComandClose}
>
<label htmlFor="imageInput">
 <MenuItem>
 <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  style={{ display: 'none' }}
  id="imageInput"
/>
 Image <Icon icon="material-symbols:photo" /> 

 </MenuItem>
 </label>
</Menu>
        <Button onClick={handleTextCommandClick}  style ={{color:'white'}}>Text Commands</Button>
<Menu
  anchorEl={textCommandAnchorEl}
  open={Boolean(textCommandAnchorEl)}
  onClose={handleTextCommandClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
>
  <MenuItem
    onClick={(event) => handleTextFormattingMenuClick(event)}
  >
    Text Formatting <Icon icon="quill:formatting" />
  </MenuItem>
  <MenuItem onClick={(event) => handleTextBlockingMenuClick(event)}>
  Text Blocking  <Icon icon="mdi:text" />
</MenuItem>

 
</Menu>

<Menu
  anchorEl={textFormattingMenuAnchorEl}
  open={Boolean(textFormattingMenuAnchorEl)}
  onClose={handleTextFormattingMenuClose}
 anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
>
<MenuItem onClick={() => handleTextCommandSelect('BOLD')}>
    Bold <Icon icon="ooui:bold-a" height="20" />
  </MenuItem>
  <MenuItem onClick={() => handleTextCommandSelect('ITALIC')}>
    Italicize <Icon icon="ooui:italic-a" height="20" />
  </MenuItem>
  <MenuItem onClick={() => handleTextCommandSelect('UNDERLINE')}>
    Underline <Icon icon="majesticons:underline-2" height="20" />
  </MenuItem>
  <MenuItem onClick={() => handleTextCommandSelect('STRIKETHROUGH')}>
    Strikethrough <Icon icon="ooui:strikethrough-a" height="20" />
  </MenuItem>
   <MenuItem onClick={() => handleTextCommandSelect('UPPERCASE')}>
    Uppercase <Icon icon="fa6-solid:a" />
  </MenuItem>
</Menu>
<Menu
  anchorEl={textBlockingMenuAnchorEl}
  open={Boolean(textBlockingMenuAnchorEl)}
  onClose={handleTextBlockingMenuClose}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right', 
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
>
  <MenuItem onClick={handleBulletList}>
  Bullet List <Icon icon="clarity:bullet-list-line" />
  </MenuItem>
  <MenuItem onClick ={handleNumberList}>
  Numbered List <Icon icon="cil:list-numbered" />
  </MenuItem>
  <MenuItem onClick ={handleCodeBlock}>
  Code <Icon icon="material-symbols:code" />
   </MenuItem>
    <MenuItem onClick ={handleQuoteBlock}>
    Quote <Icon icon="bi:quote" />
   </MenuItem>
</Menu>



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
          <MenuItem onClick={() => handleTextCommandSelect('COLOR')}>
            Text Color (WIP)
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColor(e.target.value)}
             />
</MenuItem>
        </Menu>
      <DocumentInfo  ref={documentInfoRef}  documentName={documentName} onDocumentNameChange={handleDocumentNameChange} editorState={editorState}/>
       
         <input type="file" onChange={importDocument} style={{ display: 'none' }} id="fileInput"  accept=".pdf" />
        <label htmlFor="fileInput">
          <Button component="span" style={{ position: 'absolute', left: '12.5vw', top: '10vh',color: 'white'}}>
          <Icon icon="mdi:import" height="30" />
          </Button>
        </label>  
         <Button onClick={downloadDocument} style={{ position: 'absolute', right: '12.5vw', top: '10vh',color: 'white'}}>
          <Icon icon="material-symbols:download" height="30" />
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
