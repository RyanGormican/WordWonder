import React, {useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { AtomicBlockUtils, Editor, EditorState, RichUtils,Modifier, Entity,ContentBlock, ContentState, InlineStyle, SelectionState } from 'draft-js';
const TextCommands = ({editorState, handleEditorStateChange}) => {
const [textFormattingMenuAnchorEl, setTextFormattingMenuAnchorEl] = useState(null);
const [textCommandAnchorEl, setTextCommandAnchorEl] = useState(null);
const [textBlockingMenuAnchorEl, setTextBlockingMenuAnchorEl] = useState(null);


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
const handleTextCommandClose = () => {
    setTextCommandAnchorEl(null);
    setTextFormattingMenuAnchorEl(null);
    setTextBlockingMenuAnchorEl(null);
  };

  const handleTextFormattingMenuClose = () => {
    setTextFormattingMenuAnchorEl(null);
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
    const newEditorState = RichUtils.toggleInlineStyle(editorState, style);
    handleEditorStateChange(newEditorState);
  }
};

  
  const handleTextCommandClick = (event) => {
    setTextCommandAnchorEl(event.currentTarget);
  };


  const handleTextFormattingMenuClick = (event) => {
    setTextFormattingMenuAnchorEl(event.currentTarget);
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
  </MenuItem>
  <MenuItem onClick={(event) => handleTextBlockingMenuClick(event)}>
  Text Blocking  <Icon icon="mdi:text" />
</MenuItem>
<MenuItem onClick={handleClearFormatting}>
  Clear Formatting <Icon icon="material-symbols:format-clear"/>
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
</div>
);

};
export default TextCommands;