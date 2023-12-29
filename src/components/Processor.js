import React, { useState } from 'react';
import { Editor, EditorState, RichUtils,Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { getDocument } from 'pdfjs-dist';
import createStyles from 'draft-js-custom-styles';
import { stateToHTML } from 'draft-js-export-html';
import htmlToPdfMake from 'html-to-pdfmake';
const Processor = () => {
  const [words, setWords] = useState(0);
   const [characters, setCharacters] = useState(0);
  const [editorState, setEditorState, ContentState] = useState(() => EditorState.createEmpty());
  const [fontSize, setFontSize] = useState(14);
  const [documentName, setDocumentName] = useState('document');
  const [textColor, setTextColor] = useState('black');
  const [isUppercase, setIsUppercase] = useState(false);
   const [textFormattingMenuAnchorEl, setTextFormattingMenuAnchorEl] = useState(null);
  const [textCommandAnchorEl, setTextCommandAnchorEl] = useState(null);
   const [textStylesAnchorEl, setTextStylesAnchorEl] = useState(null);
   const [documentInformationAnchorEl, setDocumentInformationAnchorE1] = useState(null);
 
 const toggleInlineStyle = (style) => {
  if (style === 'SUBSCRIPT' || style === 'SUPERSCRIPT') {
    applySubSuperscript(style);
  } else if (style.startsWith('fontSize')) {
    setFontSize(parseInt(style.replace('FONT_SIZE-', ''), 10));
    changeFontSize(fontSize);
  } else if (style.startsWith('COLOR-')) {
    setTextColor(style.replace('COLOR-', ''));
    changeTextColor(textColor);
  } else if (style === 'UPPERCASE') {
    setIsUppercase(!isUppercase);
    changeUppercase(isUppercase);
  } else {
    setEditorState((prevEditorState) =>
      RichUtils.toggleInlineStyle(prevEditorState, style)
    );
  }
};
 const countCharacters = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText('');
    setCharacters(plainText.length);
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
      setEditorState(newEditorState);
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
const handleTextCommandClose = () => {
    setTextCommandAnchorEl(null);
    setTextFormattingMenuAnchorEl(null);
    setTextStylesAnchorEl(null);
  };

  const handleTextFormattingMenuClose = () => {
    setTextFormattingMenuAnchorEl(null);
  };

  const handleTextStylesClose = () => {
    setTextStylesAnchorEl(null);
  };

  const handleDocumentInformationClose = () => {
    setDocumentInformationAnchorE1(null);
  };

  
  const handleTextCommandSelect = (style) => {
    if (style === 'TEXT_FORMATTING') {
      handleTextFormattingMenuClick();
    } else if (style === 'DOCUMENT_INFORMATION') {
      handleDocumentInformationClick();
    } else {
      toggleInlineStyle(style);
     
      if (style === 'BOLD' || style === 'ITALIC' || style === 'UNDERLINE' || style === 'STRIKETHROUGH') {
     
      } else if (style === 'FONT_SIZE' || style === 'COLOR') {
      
      }
    }
  };

  const handleTextCommandClick = (event) => {
    setTextCommandAnchorEl(event.currentTarget);
  };


  const handleTextFormattingMenuClick = (event) => {
    setTextFormattingMenuAnchorEl(event.currentTarget);
  };

const {styles, customStyleFn, exporter } = createStyles(['font-size','color'])
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
  setEditorState((prevEditorState) =>
    RichUtils.toggleInlineStyle(prevEditorState, `COLOR-${newColor}`)
  );
};
const changeUppercase = (shouldBeUppercase) => {
  setEditorState((prevEditorState) => {
    const contentState = Modifier.replaceText(
      prevEditorState.getCurrentContent(),
      prevEditorState.getSelection(),
      shouldBeUppercase
        ? prevEditorState.getCurrentContent().getPlainText().toUpperCase()
        : prevEditorState.getCurrentContent().getPlainText()
    );

    return EditorState.push(prevEditorState, contentState, 'replace-text');
  });
};


const changeFontSize = (newFontSize) => {
  const newEditorState = styles.fontSize.remove(editorState);
  setEditorState(styles.fontSize.add(newEditorState,  `${newFontSize}px`));
};

   const handleTextStylesClick = (event) => {
    setTextStylesAnchorEl(event.currentTarget);
  };
  const handleDocumentInformationClick = (event) => {
    setDocumentInformationAnchorE1(event.currentTarget);
  }
 const handleColor = (event) => {
 setTextColor(event);
   const newEditorState = styles.color.remove(editorState);
  setEditorState(styles.color.add(newEditorState,  event));   
 }
  const applySubSuperscript = (style) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();

    const newContentState = Modifier.removeInlineStyle(
      contentState,
      selection,
      'SUBSCRIPT'
    );
    const newContentStateWithStyle = Modifier.removeInlineStyle(
      newContentState,
      selection,
      'SUPERSCRIPT'
    );

    const newSelection = selection.merge({
      anchorKey: selection.getAnchorKey(),
      focusKey: selection.getFocusKey(),
    });

    const finalContentState = Modifier.applyInlineStyle(
      newContentStateWithStyle,
      newSelection,
      style
    );

    const newEditorState = EditorState.push(
      editorState,
      finalContentState,
      'change-inline-style'
    );

    setEditorState(
      RichUtils.toggleInlineStyle(newEditorState, currentStyle)
    );
  };

  const countWords = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const wordCount = plainText
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .length;
    setWords(wordCount);
  };

const downloadDocument = () => {
  const contentState = editorState.getCurrentContent();
  const inlineStyles = exporter(editorState);
  const htmlContent = stateToHTML(contentState, { inlineStyles });

  const pdfElement = document.createElement('div');
  pdfElement.innerHTML = htmlContent;

  html2pdf(pdfElement, {
    margin: 10,
    filename: `${documentName}.pdf`,
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });
};


  return (
    <div>
      <span className="activity">
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
    Text Formatting
  </MenuItem>
  <MenuItem onClick={() => handleTextCommandSelect('UPPERCASE')}>
    Uppercase
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
</Menu>



         <Button onClick={handleTextStylesClick}  style ={{color:'white'}}>Text Styles</Button>
        <Menu
          anchorEl={textStylesAnchorEl}
          open={Boolean(textStylesAnchorEl)}
          onClose={handleTextStylesClose}
        >
          <MenuItem>
            Font Size
            <Button onClick={handleFontSizeDecrease}>-</Button>
            {fontSize}
            <Button onClick={handleFontSizeIncrease}>+</Button>
          </MenuItem>
          <MenuItem onClick={() => handleTextCommandSelect('COLOR')}>
            Text Color 
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColor(e.target.value)}
             />
</MenuItem>
        </Menu>
        
         <Button onClick={handleDocumentInformationClick}  style ={{color:'white'}}>Document Information</Button>
       <Menu
         anchorEl={documentInformationAnchorEl}
          open={Boolean(documentInformationAnchorEl)}
          onClose={handleDocumentInformationClose}>
         <MenuItem>
        Document Name
           <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
             />
        </MenuItem>
        <MenuItem>
        {words === 0 || words > 1 ? `${words} words` : `${words} word`}
        </MenuItem>
        <MenuItem>
        {characters === 0 || characters > 1 ? `${characters} characters` : `${characters} character`}
        </MenuItem>
         </Menu>
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
          onChange={(newEditorState) => {
            setEditorState(newEditorState);
            countWords();
            countCharacters(); 
          }}
          wrapperClassName="processor-wrapper"
          editorClassName="processor-editor"
          spellCheck={true}
          customStyleFn={customStyleFn}
        />
      </div>
    </div>
  );
};

export default Processor;
