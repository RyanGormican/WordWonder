import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { stateToHTML } from 'draft-js-export-html';
import html2pdf from 'html2pdf.js';
const Export = ({editorState, documentName, exportFormat} ) => {
const downloadDocument = () => {
  const contentState = editorState.getCurrentContent();
  const htmlContent = stateToHTML(contentState);
   if (exportFormat === 'pdf' ) {
  const pdfElement = document.createElement('div');
  pdfElement.innerHTML = htmlContent;

  html2pdf(pdfElement, {
    margin: 10,
    filename: `${documentName}.pdf`,
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });
  } else if (exportFormat === 'txt') {
      const plainText = contentState.getPlainText();
      const blob = new Blob([plainText], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${documentName}.txt`;
      link.click();
    }else if (exportFormat === 'html') {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${documentName}.html`;
      link.click();
    }
};
return(
	<div>
	 <Button onClick={downloadDocument} style={{ color: 'white'}}>
          <Icon icon="material-symbols:download" height="30" />
        </Button>
	</div>
)
};
export default Export;