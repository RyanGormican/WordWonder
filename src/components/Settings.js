import React, { useState, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

const Settings = ({ darkMode, settings, handleSettingsChange }) => {
  const [settingsAnchorE1, setSettingsAnchorE1] = useState(null);
  const [textToSpeechCommandAnchorE1, setTextToSpeechCommandAnchorE1] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const availableVoices = speechSynthesis.getVoices();
  useEffect(() => {
    const updateAvailableLanguages = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableLanguages([...new Set(voices.map((voice) => voice.lang))]);
    };

    window.speechSynthesis.addEventListener('voiceschanged', updateAvailableLanguages);

    updateAvailableLanguages();

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateAvailableLanguages);
    };
  }, []);

  const handleSettingsCommandClick = (event) => {
    setSettingsAnchorE1(event.currentTarget);
  };

  const handleTextToSpeechCommandClick = (event) => {
    setTextToSpeechCommandAnchorE1(event.currentTarget);
  };

  const handletextToSpeechCommandClose = () => {
    setTextToSpeechCommandAnchorE1(null);
  };

  const handleSettingsCommandClose = () => {
    setSettingsAnchorE1(null);
    setTextToSpeechCommandAnchorE1(null);
  };

  const handleVoiceChange = (newVoice) => {
    handleSettingsChange({ ...settings, voice: newVoice });
  };

  const handleSpeedChange = (newSpeed) => {
    handleSettingsChange({ ...settings, speed: newSpeed });
  };

  const handlePitchChange = (newPitch) => {
    handleSettingsChange({ ...settings, pitch: newPitch });
  };

  const handleVolumeChange = (newVolume) => {
    handleSettingsChange({ ...settings, volume: newVolume });
  };

  const handleLangChange = (newLang) => {
    handleSettingsChange({ ...settings, lang: newLang });
  };

  return (
    <div>
      <Button onClick={handleSettingsCommandClick} style={{ color: 'white' }}>
        <Icon icon="material-symbols:settings" height="30" color={darkMode ? 'white' : 'black'} />
      </Button>
      <Menu
        anchorEl={settingsAnchorE1}
        open={Boolean(settingsAnchorE1)}
        onClose={handleSettingsCommandClose}
      >
        <MenuItem onClick={handleTextToSpeechCommandClick}>
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
          <select value={settings.voice} onChange={(e) => handleVoiceChange(e.target.value)}>
            {settings.voice && (
              <option key={settings.voice} value={settings.voice}>
                {settings.voice}
              </option>
            )}
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
            min="0.1"
            max="10"
            step="0.1"
            value={settings.speed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          />
          {settings.speed}
        </MenuItem>
        <MenuItem>
          <span>Pitch:</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.pitch}
            onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
          />
          {settings.pitch}
        </MenuItem>
        <MenuItem>
          <span>Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
          {settings.volume}
        </MenuItem>
        <MenuItem>
          <span>Language:</span>
          <select value={settings.lang} onChange={(e) => handleLangChange(e.target.value)}>
            {settings.lang && (
              <option key={settings.lang} value={settings.lang}>
                {settings.lang}
              </option>
            )}
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Settings;
