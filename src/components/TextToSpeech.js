import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
const TextToSpeech = ({darkMode, editorState}) => {
  const { speechSynthesis } = window;
const handleTextToSpeech = () => {
    const selectedText = getSelectedText();
    const utterance = new SpeechSynthesisUtterance(selectedText);
    speechSynthesis.speak(utterance);
};

const getSelectedText = () => {
  const selection = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const selectedBlock = currentContent.getBlockForKey(selection.getStartKey());
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  const selectedText = selectedBlock.getText().slice(start, end);

  return selectedText;
};
return (
    <div> 
<Button onClick={handleTextToSpeech} style={{ color: 'white' }}>
      <Icon icon="material-symbols:text-to-speech" height ="30" color={darkMode? 'white': 'black'}/>
      </Button>
     </div>
);
}; 
export default TextToSpeech;