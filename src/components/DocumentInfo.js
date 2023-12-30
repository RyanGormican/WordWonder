import React, { useState, forwardRef, useImperativeHandle } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
const DocumentInfo = ({ documentName, onDocumentNameChange, editorState },ref) => {
  const handleDocumentNameChange = (e) => {
    onDocumentNameChange(e.target.value);
  };
 const countCharacters = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText('');
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
const [words, setWords] = useState(0);
   const [characters, setCharacters] = useState(0);
    const [selectedWords, setSelectedWords] = useState(0);
  const [selectedCharacters, setSelectedCharacters] = useState(0);
  const [documentInformationAnchorEl, setDocumentInformationAnchorE1] = useState(null);
   const handleDocumentInformationClose = () => {
    setDocumentInformationAnchorE1(null);
  };
   const handleDocumentInformationClick = (event) => {
    setDocumentInformationAnchorE1(event.currentTarget);
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
              onChange={handleDocumentNameChange}
             />
        </MenuItem>
        <MenuItem>
        {words === 0 || words > 1 ? `${words} words (${selectedWords} selected)` : `${words} word (${selectedWords} selected)`}
        </MenuItem>
        <MenuItem>
        {characters === 0 || characters > 1 ? `${characters} characters (${selectedCharacters} selected)` : `${characters} character (${selectedCharacters} selected)`}
        </MenuItem>
         </Menu>
	</div>
);
}
export default React.forwardRef(DocumentInfo);