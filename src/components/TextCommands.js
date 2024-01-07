import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import {EditorState, RichUtils,Modifier,ContentBlock } from 'draft-js';
const TextCommands = ({editorState, handleEditorStateChange}) => {
const [textFormattingMenuAnchorEl, setTextFormattingMenuAnchorEl] = useState(null);
const [textCommandAnchorEl, setTextCommandAnchorEl] = useState(null);
const [textBlockingMenuAnchorEl, setTextBlockingMenuAnchorEl] = useState(null);
const [textAlignmentMenuAnchorEl, setTextAlignmentMenuAnchorEl] = useState(null);
const [headingsMenuAnchorEl, setHeadingsMenuAnchorEl] = useState(null);
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
const handleHeading = (header) => {
  handleEditorStateChange(RichUtils.toggleBlockType(editorState, header));
};
const handleParagraph = () => {
handleEditorStateChange(RichUtils.toggleBlockType(editorState, 'unstyled'));
};
const handleTextCommandClose = () => {
    setTextCommandAnchorEl(null);
    setTextFormattingMenuAnchorEl(null);
    setTextBlockingMenuAnchorEl(null);
    setTextAlignmentMenuAnchorEl(null);
   setHeadingsMenuAnchorEl(null);
  };

  const handleTextFormattingMenuClose = () => {
    setTextFormattingMenuAnchorEl(null);
  };
  const handleHeadingsMenuClick = (event) => {
        setHeadingsMenuAnchorEl(event.currentTarget);
  };
  const handleHeadingsMenuClose= () =>{
     setHeadingsMenuAnchorEl(null);
  }

 const handleTextBlockingMenuClick = (event) => {
  setTextBlockingMenuAnchorEl(event.currentTarget);
};

const handleTextBlockingMenuClose = () => {
  setTextBlockingMenuAnchorEl(null);
};
const handleTextAlignmentMenuClose = () => {
  setTextAlignmentMenuAnchorEl(null);
};

const handleTextCommandSelect = (style) => {
  if (style === 'TEXT_FORMATTING') {
    handleTextFormattingMenuClick();
  } else if (style === 'DOCUMENT_INFORMATION') {
  
  } else if (style === 'UPPERCASE') {
    convertToUppercase();
  } else {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, style);
    handleEditorStateChange(newEditorState);
  }
};

const handleTextAlignment = (alignment) => {

};


  const handleTextCommandClick = (event) => {
    setTextCommandAnchorEl(event.currentTarget);
  };


  const handleTextFormattingMenuClick = (event) => {
    setTextFormattingMenuAnchorEl(event.currentTarget);
  };
  const handleTextAlignmentMenuClick = (event)=> {
   setTextAlignmentMenuAnchorEl(event.currentTarget);
  };
const handleClearFormatting = () => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const currentInlineStyle = editorState.getCurrentInlineStyle();

  let newContentState = contentState;

  currentInlineStyle.forEach((style) => {
    newContentState = Modifier.removeInlineStyle(newContentState, selection, style);
  });
 
  const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
  handleEditorStateChange(newEditorState);
};
const convertToUppercase = () => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const blockKey = selection.getStartKey();
  const block = contentState.getBlockForKey(blockKey);

  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  const selectedText = block.getText().slice(startOffset, endOffset);

  const inlineStyles = block.getInlineStyleAt(startOffset);

  const newContentBlock = new ContentBlock({
    key: blockKey,
    text: block.getText().replace(selectedText, selectedText.toUpperCase()),
    type: block.getType(),
    data: block.getData(),
    characterList: block.getCharacterList().map((char, index) => {
      return index >= startOffset && index < endOffset ? char.set('style', inlineStyles) : char;
    }),
  });

  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(blockKey, newContentBlock),
  });

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'replace-text'
  );

  handleEditorStateChange(newEditorState);
};



return (
<div>
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
     <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle' }}/>
  </MenuItem>
  <MenuItem onClick={(event) => handleTextBlockingMenuClick(event)}>
  Text Blocking  <Icon icon="mdi:text" />
   <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle' }}/>
</MenuItem>
<MenuItem style={{ display: 'block' }} onClick={(event) => handleTextAlignmentMenuClick(event)}>
Text Alignment(WIP) <Icon icon="streamline:interface-text-formatting-left-align-paragraph-text-alignment-align-left-formatting-right" />
 <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle' }}/>
</MenuItem>
 <MenuItem onClick={(event) => handleHeadingsMenuClick(event)}>
 Headings  <Icon icon="tabler:heading" />
   <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle' }}/>
</MenuItem>
<MenuItem onClick={handleParagraph}>
Paragraph <Icon icon="system-uicons:paragraph-end" />
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
<MenuItem onClick={handleClearFormatting}>
    Clear Formatting <Icon icon="material-symbols:format-clear" height="20" />
  </MenuItem>
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
<Menu
  anchorEl={textAlignmentMenuAnchorEl}
  open={Boolean(textAlignmentMenuAnchorEl)}
  onClose={handleTextAlignmentMenuClose}
 anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
>
 <MenuItem onClick={() => handleTextAlignment('left')}>
          Left (WIP)<Icon icon="bi:text-left" />
        </MenuItem>
        <MenuItem onClick={() => handleTextAlignment('center')}>
          Center (WIP)<Icon icon="bi:text-center" />
        </MenuItem>
        <MenuItem onClick={() => handleTextAlignment('right')}>
          Right (WIP)<Icon icon="bi:text-right" />
        </MenuItem>
         <MenuItem onClick={() => handleTextAlignment('justify')}>
          Justify (WIP)<Icon icon="bi:justify" />
        </MenuItem>
</Menu>
<Menu
  anchorEl={headingsMenuAnchorEl}
  open={Boolean(headingsMenuAnchorEl)}
  onClose={handleHeadingsMenuClose}
 anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
>
        <MenuItem onClick={() => handleHeading('header-one')}>
        <Icon icon="gravity-ui:heading-1" />
        </MenuItem>
         <MenuItem onClick={() => handleHeading('header-two')}>
        <Icon icon="gravity-ui:heading-2" />
        </MenuItem>
         <MenuItem onClick={() => handleHeading('header-three')}>
        <Icon icon="gravity-ui:heading-3" />
        </MenuItem>
          <MenuItem onClick={() => handleHeading('header-four')}>
        <Icon icon="gravity-ui:heading-4" />
        </MenuItem>
         <MenuItem onClick={() => handleHeading('header-five')}>
        <Icon icon="gravity-ui:heading-5" />
        </MenuItem>
         <MenuItem onClick={() => handleHeading('header-six')}>
        <Icon icon="gravity-ui:heading-6" />
        </MenuItem>
</Menu>
</div>
);

};
export default TextCommands;