import React from 'react';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
import { stateToMarkdown } from 'draft-js-export-markdown';
const Export = ({ darkMode, editorState, documentName, styleMap, exportFormat, comments }) => {
const downloadDocument = () => {
  const contentState = editorState.getCurrentContent();
  const blocks = contentState.getBlockMap();

  let htmlContent = '';

  blocks.forEach((block) => {
    const text = block.getText();

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      let inlineStyleHtml = '';
         let shouldUnderline = false;
    let shouldStrikethrough = false;
      const inlineStyles = block.getInlineStyleAt(i);

      inlineStyles.forEach((style) => {
        if (styleMap[style]) {
          if (styleMap[style].id === 'font') {
            inlineStyleHtml += `font-family: ${style};`;
          } else if (styleMap[style].id === 'color') {
            inlineStyleHtml += `color: ${styleMap[style].color};`;
          } else if (styleMap[style].id === 'fontSize') {
            inlineStyleHtml += `font-size: ${styleMap[style].fontSize};`;
          } else if (styleMap[style].id === 'colorbackground') {
            inlineStyleHtml += `background-color: ${styleMap[style].backgroundColor};`;
          } 
          }

          if (style === 'BOLD') {
            inlineStyleHtml += 'font-weight: bold;';
          } else if (style === 'ITALIC') {
            inlineStyleHtml += 'font-style: italic;';
          } else if (style === 'UNDERLINE') {
          shouldUnderline = true;
          } else if (style === 'STRIKETHROUGH') {
        shouldStrikethrough = true;
          } else {
          }
      });
    if (shouldUnderline && shouldStrikethrough){
        inlineStyleHtml += 'text-decoration: underline line-through;';
    } else if (shouldUnderline) {
      inlineStyleHtml += 'text-decoration: underline;';
    }else if (shouldStrikethrough) {
      inlineStyleHtml += 'text-decoration: line-through;';
    }
      if (inlineStyleHtml) {
        htmlContent += `<span style="${inlineStyleHtml}">${char}</span>`;
      } else {
        htmlContent += char;
      }
    }
    htmlContent += '<br>';
  });
  contentState.getBlockMap().forEach((block) => {
    block.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType() === 'image';
      },
      (start, end) => {
        const entityKey = block.getEntityAt(start);
        const entity = contentState.getEntity(entityKey);
        const { src, alt, width, height } = entity.getData();
        htmlContent += `<img src="${src}" alt="${alt}" style="max-width:100%; width:${width}px; height:${height}px;" />`;
      }
    );
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
    } else if (exportFormat === 'markdown') {
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
      <Button onClick={downloadDocument} style={{ color: darkMode ? 'white' : 'black' }}>
        <Icon icon="material-symbols:download" height="30" />
      </Button>
    </div>
  );
};

export default Export;
