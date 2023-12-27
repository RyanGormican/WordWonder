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
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [textCommandAnchorEl, setTextCommandAnchorEl] = useState(null);

  const toggleInlineStyle = (style) => {
    if (style === 'SUBSCRIPT' || style === 'SUPERSCRIPT') {
      applySubSuperscript(style);
    } else {
      setEditorState((prevEditorState) =>
        RichUtils.toggleInlineStyle(prevEditorState, style)
      );
    }
  };

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

  const handleTextCommandClick = (event) => {
    setTextCommandAnchorEl(event.currentTarget);
  };

  const handleTextCommandClose = () => {
    setTextCommandAnchorEl(null);
  };

  const handleTextCommandSelect = (style) => {
    toggleInlineStyle(style);
    handleTextCommandClose();
  };

  const downloadDocument = () => {
    const plainText = editorState.getCurrentContent().getPlainText();
    const pdfElement = document.createElement('div');
    pdfElement.innerText = plainText;

    html2pdf(pdfElement, {
      margin: 10,
      filename: 'document.pdf',
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  };

  return (
    <div>
      <span className="activity">
        <Button onClick={handleTextCommandClick}>Text Commands</Button>
        <Menu
          anchorEl={textCommandAnchorEl}
          open={Boolean(textCommandAnchorEl)}
          onClose={handleTextCommandClose}
        >
          <MenuItem onClick={() => handleTextCommandSelect('ITALIC')}>
            Italicize <Icon icon="ooui:italic-a" height="20" />
          </MenuItem>
          <MenuItem onClick={() => handleTextCommandSelect('BOLD')}>
            Bold <Icon icon="ooui:bold-a" height="20" />
          </MenuItem>
          <MenuItem onClick={() => handleTextCommandSelect('UNDERLINE')}>
            Underline <Icon icon="majesticons:underline-2" height="20" />
          </MenuItem>
          <MenuItem onClick={() => handleTextCommandSelect('STRIKETHROUGH')}>
            Strikethrough <Icon icon="ooui:strikethrough-a" height="20" />
          </MenuItem>
        </Menu>

        <button onClick={downloadDocument}>
          <Icon icon="material-symbols:download" height="30" />
        </button>
        {words === 0 || words > 1 ? `${words} words` : `${words} word`}
      </span>

      <div className="processor">
        <Editor
          editorState={editorState}
          onChange={(newEditorState) => {
            setEditorState(newEditorState);
            countWords();
          }}
          wrapperClassName="processor-wrapper"
          editorClassName="processor-editor"
        />
      </div>
    </div>
  );
};

export default Processor;
