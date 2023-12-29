import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

const Processor = () => {
  const [words, setWords] = useState(0);
   const [characters, setCharacters] = useState(0);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [fontSize, setFontSize] = useState(12);
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
        handleTextStylesClose();
      }
    }
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
  setEditorState((prevEditorState) => RichUtils.toggleInlineStyle(prevEditorState, newFontSize));
};

   const handleTextStylesClick = (event) => {
    setTextStylesAnchorEl(event.currentTarget);
  };
  const handleDocumentInformationClick = (event) => {
    setDocumentInformationAnchorE1(event.currentTarget);
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
    const plainText = editorState.getCurrentContent().getPlainText();
    const pdfElement = document.createElement('div');
    pdfElement.innerText = plainText;
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
              onChange={(e) => setTextColor(e.target.value)}
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
         <button onClick={downloadDocument} style={{ position: 'absolute', right: '12.5vw', top: '10vh'}}>
          <Icon icon="material-symbols:download" height="30" />
        </button>
    
      </span>

      <div className="processor">
        <Editor
          editorState={editorState}
          editorStyle={{fontSize}}
          onChange={(newEditorState) => {
            setEditorState(newEditorState);
            countWords();
            countCharacters(); 
          }}
          wrapperClassName="processor-wrapper"
          editorClassName="processor-editor"
        />
      </div>
    </div>
  );
};

export default Processor;
