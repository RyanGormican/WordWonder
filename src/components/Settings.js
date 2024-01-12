import React, { useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
const Settings = ({darkMode}) => {
const [settingsAnchorE1, setSettingsAnchorE1] = useState(null);
const [textToSpeechCommandAnchorE1, setTextToSpeechCommandAnchorE1] = useState(null);
  const { speechSynthesis } = window;
 const availableVoices = speechSynthesis.getVoices();
 const [selectedVoice, setSelectedVoice] = useState(null);
  const [speed, setSpeed] = useState(1.0);

  const handleSettingsCommandClick = (event) => {
    setSettingsAnchorE1(event.currentTarget);
  };
   const handleTextToSpeechCommandClick = (event) => {
    setTextToSpeechCommandAnchorE1(event.currentTarget);
  };
    const handletextToSpeechCommandClose = () => {
    setTextToSpeechCommandAnchorE1(null);
  };
  const handleSettingsCommandClose = (event) => {
    setSettingsAnchorE1(null);
    setTextToSpeechCommandAnchorE1(null);
  };
    const handleVoiceChange = (voice) => {
    setSelectedVoice(voice);
  };
   const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };
return (
    <div> 
<Button onClick={handleSettingsCommandClick} style={{ color: 'white' }}>
      <Icon icon="material-symbols:settings" height ="30" color={darkMode? 'white': 'black'}/>
      </Button>
      <Menu
        anchorEl={settingsAnchorE1}
        open={Boolean(settingsAnchorE1)}
        onClose={handleSettingsCommandClose}
      >
      <MenuItem onClick = {handleTextToSpeechCommandClick}>
      Text To Speech 
      <Icon icon="material-symbols:text-to-speech" />
      </MenuItem>
      </Menu>
        <Menu
        anchorEl={textToSpeechCommandAnchorE1}
        open={Boolean(textToSpeechCommandAnchorE1)}
        onClose={handletextToSpeechCommandClose}
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
            <span>Voice:</span>
            <select onChange={(e) => handleVoiceChange(e.target.value)}>
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </MenuItem>
        <MenuItem>
    
            <span>Speed:</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            />
            {speed}
        </MenuItem>
      </Menu>
     </div>

);
}; 
export default Settings;