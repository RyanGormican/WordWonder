import React, { useState} from 'react';
import {Modifier, EditorState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';

const VoiceInput = ({ editorState, handleEditorStateChange}) => {
const [isListening, setIsListening] = useState(false); 
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    let recognitionIsRunning = false;
const handleVoiceButtonClick = () => {
    if (recognitionIsRunning) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  recognition.onstart = () => {
    setIsListening(true);
    recognitionIsRunning = true;
  };

  recognition.onend = () => {
    setIsListening(false);
    recognitionIsRunning = false;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const updatedEditorState = handleTranscribedText(transcript);
    handleEditorStateChange(updatedEditorState);
  };

  const handleTranscribedText = (transcript) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const newContentState = contentState.createEntity('TOKEN', 'IMMUTABLE', { text: transcript });
    const entityKey = newContentState.getLastCreatedEntityKey();
    const textWithEntity = `${transcript} `;
    const updatedContentState = Modifier.replaceText(contentState, selectionState, textWithEntity, null, entityKey);
    const updatedEditorState = EditorState.push(editorState, updatedContentState, 'insert-characters');
    return updatedEditorState;
  };
return (
    <div>
<Button style={{color: isListening? 'red':'white'}} onClick={handleVoiceButtonClick}>
      <Icon icon="mdi:microphone" height="30"/>
      </Button>
      </div>
)};
export default VoiceInput;