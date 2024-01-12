import React from 'react';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { stateToHTML } from 'draft-js-export-html';
import html2pdf from 'html2pdf.js';
import { stateToMarkdown } from 'draft-js-export-markdown';
const Export = ({darkMode, editorState, documentName, exportFormat }) => {
  const downloadDocument = () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState, {
      blockRenderers: {
        atomic: (block) => {
          const entity = contentState.getEntity(block.getEntityAt(0));
          if (entity.getType() === 'DATETIME') {
            const value = entity.getData().value;
            return `<div>${value}</div>`;
          } else if (entity.getType() === 'image') {
            const data = entity.getData();
            return `<img src="${data.src}" alt="${data.alt}" style="max-width: 100%;" />`;
          }
          return '';
        },
      },
    });

    if (exportFormat === 'pdf') {
      const pdfElement = document.createElement('div');
      pdfElement.innerHTML = htmlContent;

      html2pdf(pdfElement, {
        margin: 10,
        filename: `${documentName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      });
    } else if (exportFormat === 'txt') {
      const plainText = contentState.getPlainText();
      const blob = new Blob([plainText], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${documentName}.txt`;
      link.click();
    } else if (exportFormat === 'html') {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${documentName}.html`;
      link.click();
    }else if (exportFormat === 'markdown') {
      const markdownContent = stateToMarkdown(contentState);
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${documentName}.md`;
      link.click();
    }
  };

  return (
    <div>
      <Button onClick={downloadDocument} style={{ color: darkMode? 'white': 'black' }}>
        <Icon icon="material-symbols:download" height="30" />
      </Button>
    </div>
  );
};

export default Export;
