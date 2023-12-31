import React, { useState, forwardRef, useImperativeHandle } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList'; 
import { Icon } from '@iconify/react';
const DocumentInfo = ({ documentName, onDocumentNameChange, editorState },ref) => {
const [words, setWords] = useState(0);
   const [characters, setCharacters] = useState(0);
    const [selectedWords, setSelectedWords] = useState(0);
     const [maxWordCount, setMaxWordCount] = useState(0);
     const [minWordCount, setMinWordCount] = useState(0);
     const [maxCharacterCount, setMaxCharacterCount] = useState(0);
     const [minCharacterCount, setMinCharacterCount] = useState(0);
  const [isOverWordLimit, setIsOverWordLimit] = useState(false);
  const [isUnderWordLimit, setIsUnderWordLimit] = useState(false);
  const [isOverCharacterLimit, setIsOverCharacterLimit] = useState(false);
  const [isUnderCharacterLimit, setIsUnderCharacterLimit] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState(0);
  const [documentInformationAnchorEl, setDocumentInformationAnchorE1] = useState(null); 
  const [textLimitsMenuAnchorEl, setTextLimitstMenuAnchorEl] = useState(null);
const handleDocumentNameChange = (e) => {
    onDocumentNameChange(e.target.value);
  };

 const checkCharacterLimit = () => {
  if (maxCharacterCount > 0){
    setIsOverCharacterLimit(characters > maxCharacterCount);
  }else{
    setIsOverCharacterLimit(false);
  }
  if (minCharacterCount > 0){
      setIsUnderCharacterLimit(characters > minCharacterCount);
  }else{
    setIsUnderCharacterLimit(false);
  }
  };
 const countCharacters = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText('');
    checkCharacterLimit();
    setCharacters(plainText.length);
  };
const countSelected = () => {
  const selectedText = getSelectedText(editorState);

  const selectedWordCount = selectedText
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .length;


  const selectedCharacterCount = selectedText.length;

  setSelectedWords(selectedWordCount);
  setSelectedCharacters(selectedCharacterCount);
  };
   const handleDocumentInformationClose = () => {
    setDocumentInformationAnchorE1(null);
    setTextLimitstMenuAnchorEl(null);
  };
   const handleDocumentInformationClick = (event) => {
    setDocumentInformationAnchorE1(event.currentTarget);
  };
    const handleTextLimitsMenuClick = (event) => {
    setTextLimitstMenuAnchorEl(event.currentTarget);
  };
   const handleTextLimitsMenuClose = (event) => {
    setTextLimitstMenuAnchorEl(null);
  };
  const checkWordLimit = () => {
  if (maxWordCount > 0){
    setIsOverWordLimit(words > maxWordCount);
  }else{
    setIsOverWordLimit(false);
  }
  if (minWordCount > 0){
    setIsUnderWordLimit(words > minWordCount);
  }else{
    setIsUnderWordLimit(false);
  }
  };
  const countWords = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const wordCount = plainText
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .length;
    setWords(wordCount);
     checkWordLimit();
  };

const getSelectedText = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  
  
  if (startKey === endKey) {
    return contentState.getBlockForKey(startKey).getText().slice(startOffset, endOffset);
  }
  
 
  const selectedBlocks = contentState.getBlocksAsArray().slice(
    contentState.getBlockMap().keySeq().toList().indexOf(startKey),
    contentState.getBlockMap().keySeq().toList().indexOf(endKey) + 1
  );
  
  const selectedText = selectedBlocks.map((block, index) => {
    const blockText = block.getText();
    if (index === 0) {
      return blockText.slice(startOffset);
    } else if (index === selectedBlocks.length - 1) {
      return blockText.slice(0, endOffset);
    } else {
      return blockText;
    }
  }).join('\n');

  return selectedText;
};
 useImperativeHandle(ref, () => ({
    countWords,
    countCharacters,
    countSelected,
  }));

return ( 
	<div>
	  <Button onClick={handleDocumentInformationClick}   style={{ color: isOverWordLimit || isOverCharacterLimit ? 'red': isUnderWordLimit || isUnderCharacterLimit ? 'green' :  'white' }}>Document Information</Button>
       <Menu
         anchorEl={documentInformationAnchorEl}
          open={Boolean(documentInformationAnchorEl)}
          onClose={handleDocumentInformationClose}
          anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}>
         <MenuItem>
        Document Name
           <input
              type="text"
              value={documentName}
              onChange={handleDocumentNameChange}
             />
        </MenuItem>
        <MenuItem>
        {words === 0 || words > 1 ? `${words} words (${selectedWords} selected)` : `${words} word (${selectedWords} selected)`}
        </MenuItem>
        <MenuItem>
        {characters === 0 || characters > 1 ? `${characters} characters (${selectedCharacters} selected)` : `${characters} character (${selectedCharacters} selected)`}
        </MenuItem>
        <MenuItem  onClick={(event) => handleTextLimitsMenuClick(event)}>
        Text Limits <Icon icon="zondicons:exclamation-outline" />   
        <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle', }}/>
        </MenuItem>
         </Menu>
        <Menu
  anchorEl={textLimitsMenuAnchorEl}
  open={Boolean(textLimitsMenuAnchorEl)}
  onClose={handleTextLimitsMenuClose}
 anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}
>
  <MenuItem>
          Minimum Word Count
          <input
            type="number"
            value={minWordCount}
            onChange={(e) => setMinWordCount(e.target.value)}
          />
        </MenuItem>
        <MenuItem>
       Maximum Word Count
           <input
            type="number"
            value={maxWordCount}
            onChange={(e) => setMaxWordCount(e.target.value)}
          />
        </MenuItem>
         <MenuItem>
          Minimum Character Count
          <input
            type="number"
            value={minCharacterCount}
            onChange={(e) => setMinCharacterCount(e.target.value)}
          />
        </MenuItem>
        <MenuItem>
       Maximum Character Count
           <input
            type="number"
            value={maxCharacterCount}
            onChange={(e) => setMaxCharacterCount(e.target.value)}
          />
        </MenuItem>
</Menu>
	</div>
);
}
export default React.forwardRef(DocumentInfo);