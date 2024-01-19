import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Menu } from '@mui/material';
import { Icon } from '@iconify/react';

const History = ({ darkMode, versionStack, editorState, handleEditorStateChange }) => {
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(null);
  const [oldVersion, setOldVersion] = useState(null);

  const handleHistoryClick = (event) => {
    setHistoryAnchorEl(event.currentTarget);
  };

  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const handleVersionClick = (index) => {
    setConfirmationDialogOpen(true);
    setHistoryAnchorEl(null);
    setSelectedVersionIndex(index);
    setOldVersion(editorState); 
    handleEditorStateChange(versionStack[index].editorState);
  };

  const handleConfirmRevert = () => {
    handleEditorStateChange( versionStack[selectedVersionIndex].editorState)
    setConfirmationDialogOpen(false);
    handleHistoryClose();
  };

  const handleCancelRevert = () => {
    handleEditorStateChange(oldVersion); 
    setConfirmationDialogOpen(false);
  };


  return (
    <div>
      <Button onClick={handleHistoryClick} component="span" style={{ color: darkMode ? 'white' : 'black' }}>
        <Icon icon="material-symbols:history" height="30" />
      </Button>

      <Menu
        anchorEl={historyAnchorEl}
        open={Boolean(historyAnchorEl)}
        onClose={handleHistoryClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {versionStack &&
          versionStack.map((version, index) => (
            <MenuItem key={index} onClick={() => handleVersionClick(index)}>
              Version {index + 1} - {new Date(version.timestamp).toLocaleString()}
            </MenuItem>
          ))}
      </Menu>

      <Dialog open={confirmationDialogOpen} onClose={handleCancelRevert}>
        <DialogTitle>Switch to Version {selectedVersionIndex !== null ? selectedVersionIndex + 1 : ''}?</DialogTitle>
        <DialogContent>
          Are you sure you want to switch to this version?
          <Button onClick={() => handleEditorStateChange(oldVersion)} color="primary">
            Old Version
          </Button>
          <Button onClick={() => handleEditorStateChange( versionStack[selectedVersionIndex].editorState)} color="primary">
            New Version
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRevert} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRevert} color="primary">
            Switch
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default History;
