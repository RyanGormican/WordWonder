import React from 'react';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { getDocument } from 'pdfjs-dist';
import { EditorState, ContentState } from 'draft-js';

const Import = ({ darkMode, editorState, handleEditorStateChange, onDocumentNameChange }) => {
 
 const loadTxt = async (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const textContent = event.target.result;
        console.log('Loaded TXT content:', textContent);

        const contentState = ContentState.createFromText(textContent);
        const newEditorState = EditorState.push(
          editorState,
          contentState,
          'insert-characters'
        );
        handleEditorStateChange(newEditorState);
      } catch (error) {
        console.error('Error loading TXT:', error);
      }
    };

    reader.readAsText(file);
  };

  const loadPdf = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const pdfData = new Uint8Array(arrayBuffer);

      try {
        const loadingTask = getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        let textContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const pageText = await page.getTextContent();
          textContent += pageText.items.map((item) => item.str).join(' ');
        }

        const contentState = ContentState.createFromText(textContent);
        const newEditorState = EditorState.push(
          editorState,
          contentState,
          'insert-characters'
        );
        handleEditorStateChange(newEditorState);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const importDocument = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type === 'text/plain') {
        loadTxt(file);
      } else if (file.type === 'application/pdf') {
        loadPdf(file);
      }

       if (onDocumentNameChange) {
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      onDocumentNameChange(fileNameWithoutExtension);
    }
    }
  };

  return (
    <div>
      <input type="file" onChange={importDocument} style={{ display: 'none' }} id="fileInput" accept=".txt" />
      <label htmlFor="fileInput">
        <Button component="span" style={{ color:darkMode? 'white': 'black' }}>
          <Icon icon="mdi:import" height="30" />
        </Button>
      </label>
    </div>
  );
};

export default Import;