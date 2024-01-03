import React, { useState, useEffect, useImperativeHandle } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
import { stateToHTML } from 'draft-js-export-html';
const DocumentInfo = ({ documentName, onDocumentNameChange, editorState, exportFormat, onExportFormatChange },ref) => {
const [words, setWords] = useState(0);
   const [characters, setCharacters] = useState(0);
    const [selectedWords, setSelectedWords] = useState(0);
    const [paragraphs, setParagraphs] = useState(0);
  const [sentences, setSentences] = useState(0);
  const [documentSize, setDocumentSize] = useState(null);
  const [ avgWordsPerSentence, setAvgWordsPerSentence] = useState(0);
  const [avgSentencesPerParagraph, setAvgSentencesPerParagraph] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
     const [maxWordCount, setMaxWordCount] = useState(0);
     const [minWordCount, setMinWordCount] = useState(0);
     const [maxCharacterCount, setMaxCharacterCount] = useState(0);
     const [minCharacterCount, setMinCharacterCount] = useState(0);
     const [avgWordLength, setAvgWordLength] = useState(0);
  const [isOverWordLimit, setIsOverWordLimit] = useState(false);
  const [isUnderWordLimit, setIsUnderWordLimit] = useState(false);
  const [isOverCharacterLimit, setIsOverCharacterLimit] = useState(false);
  const [isUnderCharacterLimit, setIsUnderCharacterLimit] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState(0);
  const [documentInformationAnchorEl, setDocumentInformationAnchorE1] = useState(null); 
  const [textLimitsMenuAnchorEl, setTextLimitstMenuAnchorEl] = useState(null);
    const [textStatsMenuAnchorEl, setTextStatsMenuAnchorEl] = useState(null);
const handleDocumentNameChange = (e) => {
    onDocumentNameChange(e.target.value);
  };
  useEffect(() => {
  const startTime = new Date();

  const intervalId = setInterval(() => {
    const currentTime = new Date();
    const duration = Math.floor((currentTime - startTime) / 1000); 
    setSessionDuration(duration);
  }, 1000);

  return () => clearInterval(intervalId);
}, []);
 

  const handleExportFormatChange = (event) => {
    onExportFormatChange(event.target.value);
    setDocumentInformationAnchorE1(null);
  };
 const checkCharacterLimit = () => {
  if (maxCharacterCount > 0){
    setIsOverCharacterLimit(characters > maxCharacterCount);
  }else{
    setIsOverCharacterLimit(false);
  }
  if (minCharacterCount > 0){
      setIsUnderCharacterLimit(characters >= minCharacterCount);
  }else{
    setIsUnderCharacterLimit(false);
  }
  };
 const countCharacters = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText('');
    checkCharacterLimit();
    setCharacters(plainText.length);
  };
const countSelected = () => {
  const selectedText = getSelectedText(editorState);

  const selectedWordCount = selectedText
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .length;


  const selectedCharacterCount = selectedText.length;

  setSelectedWords(selectedWordCount);
  setSelectedCharacters(selectedCharacterCount);
  };
   const handleDocumentInformationClose = () => {
    setDocumentInformationAnchorE1(null);
    setTextLimitstMenuAnchorEl(null);
    setTextStatsMenuAnchorEl(null);
  };
   const handleDocumentInformationClick = (event) => {
    setDocumentInformationAnchorE1(event.currentTarget);
    getDocumentSize();
  };
    const handleTextLimitsMenuClick = (event) => {
    setTextLimitstMenuAnchorEl(event.currentTarget);
  };
   const handleTextLimitsMenuClose = (event) => {
    setTextLimitstMenuAnchorEl(null);
  };
   const handleTextStatsMenuClick = (event) => {
    setTextStatsMenuAnchorEl(event.currentTarget);
  };
   const handleTextStatsMenuClose = (event) => {
    setTextStatsMenuAnchorEl(null);
  };
  const checkWordLimit = () => {
  if (maxWordCount > 0){
    setIsOverWordLimit(words > maxWordCount);
  }else{
    setIsOverWordLimit(false);
  }
  if (minWordCount > 0){
    setIsUnderWordLimit(words >= minWordCount);
  }else{
    setIsUnderWordLimit(false);
  }
  };
  const countWords = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const wordCount = plainText
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .length;
    setWords(wordCount);
     checkWordLimit();
  };

   const calculateAvgWordLength = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText('');
    const words = plainText.split(/\s+/).filter((word) => word.length > 0);
    const totalWordLength = words.reduce((total, word) => total + word.length, 0);
    setAvgWordLength(words.length ? (totalWordLength / words.length).toFixed(1) : 0);
  };
    const countParagraphs = () => {
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlocksAsArray();
    setParagraphs(blocks.length);
  };

  const countSentences = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText('');
    const sentences = plainText.split(/[.!?]+/).filter(Boolean);
    setSentences(sentences.length);
  };

  
  const calculateAvgSentencesPerParagraph = () => {
    setAvgSentencesPerParagraph(paragraphs ? (sentences / paragraphs).toFixed(1) : 0);
  };
  const calculateAvgWordsPerSentence = () => {
    setAvgWordsPerSentence(sentences? (words / sentences).toFixed(1) : 0);
  }
const countDocumentStatistics = () => {
    calculateAvgWordLength();
     countParagraphs();
    countSentences();
    calculateAvgWordsPerSentence()
    calculateAvgSentencesPerParagraph();
  };
const getSelectedText = (editorState) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  
  
  if (startKey === endKey) {
    return contentState.getBlockForKey(startKey).getText().slice(startOffset, endOffset);
  }
  
 
  const selectedBlocks = contentState.getBlocksAsArray().slice(
    contentState.getBlockMap().keySeq().toList().indexOf(startKey),
    contentState.getBlockMap().keySeq().toList().indexOf(endKey) + 1
  );
 

  const selectedText = selectedBlocks.map((block, index) => {
    const blockText = block.getText();
    if (index === 0) {
      return blockText.slice(startOffset);
    } else if (index === selectedBlocks.length - 1) {
      return blockText.slice(0, endOffset);
    } else {
      return blockText;
    }
  }).join('\n');

  return selectedText;
};
 useImperativeHandle(ref, () => ({
    countWords,
    countCharacters,
    countSelected,
    countDocumentStatistics,
  }));
const getDocumentSize = async () => {
  const contentState = editorState.getCurrentContent();

  let sizeInBytes, size;

  if (exportFormat === 'pdf' || exportFormat ==='html') {
    const htmlContent = stateToHTML(contentState);
    const pdf = await html2pdf().from(htmlContent).outputPdf();
    sizeInBytes = pdf.length;
  } else if (exportFormat === 'txt') {
    const plainText = contentState.getPlainText();
    sizeInBytes = new Blob([plainText], { type: 'text/plain' }).size;
  }else if (exportFormat === 'markdown') {
    const markdownContent = stateToMarkdown(contentState);
    sizeInBytes = new Blob([markdownContent], { type: 'text/markdown' }).size;
  }

  if (sizeInBytes < 1024) {
    size = sizeInBytes + ' B';
  } else if (sizeInBytes < 1024 * 1024) {
    size = (sizeInBytes / 1024).toFixed(2) + ' KB';
  } else {
    size = (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  setDocumentSize(size);
};

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num) => (num < 10 ? `0${num}` : num);

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

return ( 
	<div>
	  <Button onClick={handleDocumentInformationClick}   style={{ color: isOverWordLimit || isOverCharacterLimit ? 'red': isUnderWordLimit || isUnderCharacterLimit ? 'green' :  'white' }}>Document Information</Button>
       <Menu
         anchorEl={documentInformationAnchorEl}
          open={Boolean(documentInformationAnchorEl)}
          onClose={handleDocumentInformationClose}
          anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'left',
  }}>
         <MenuItem>
        Document Name  <Icon icon="solar:document-bold" />
           <input
              type="text"
              value={documentName}
              onChange={handleDocumentNameChange}
             />
        </MenuItem>
        <MenuItem>
        Document Size <Icon icon="material-symbols:save" /> {documentSize} 
        </MenuItem>
        <MenuItem>
        Document Type <select
        id="exportFormat"
        value={exportFormat}
        onChange={handleExportFormatChange}
        style={{ marginLeft: '8px' }}
      >
        <option value="pdf">PDF</option>
        <option value="txt">TXT</option>
        <option value="html">HTML</option>
        <option value="markdown">MARKDOWN</option>
      </select>
        </MenuItem>
        <MenuItem>
        Session Duration <Icon icon="mdi:clock" /> {formatDuration(sessionDuration)}
        </MenuItem>
        <MenuItem onClick={(event) => handleTextStatsMenuClick(event)}> 
        Text Statistics <Icon icon="material-symbols:text-ad" />
        <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle', }}/>
        </MenuItem>
        <MenuItem  onClick={(event) => handleTextLimitsMenuClick(event)}>
        Text Limits <Icon icon="zondicons:exclamation-outline" />   
        <Icon icon="bxs:right-arrow" style={{ marginLeft: 'auto', marginRight: '4px', verticalAlign: 'middle', }}/>
        </MenuItem>
         </Menu>
         <Menu
          anchorEl={textStatsMenuAnchorEl}
  open={Boolean(textStatsMenuAnchorEl)}
  onClose={handleTextStatsMenuClose}
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
        {words === 0 || words > 1 ? `${words} words (${selectedWords} selected)` : `${words} word (${selectedWords} selected)`}
        </MenuItem>
        <MenuItem>
        Average Word Length {avgWordLength}
        </MenuItem>
        <MenuItem>
        {characters === 0 || characters > 1 ? `${characters} characters (${selectedCharacters} selected)` : `${characters} character (${selectedCharacters} selected)`}
        </MenuItem>
        <MenuItem>
        {sentences === 0 || sentences > 1 ? `${sentences} sentences` : `${sentences} sentence `}
        </MenuItem>
        <MenuItem>
        Average Words per Sentence {avgWordsPerSentence}
        </MenuItem>
        <MenuItem>
        {paragraphs === 0 || paragraphs > 1 ? `${paragraphs} paragraphs` : `${paragraphs} paragraph `}
        </MenuItem>
        <MenuItem>
        Average Sentences per Paragraph {avgSentencesPerParagraph}
        </MenuItem>
        </Menu>
        <Menu
  anchorEl={textLimitsMenuAnchorEl}
  open={Boolean(textLimitsMenuAnchorEl)}
  onClose={handleTextLimitsMenuClose}
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
          Minimum Word Count
          <input
            type="number"
            value={minWordCount}
            onChange={(e) => setMinWordCount(e.target.value)}
          />
        </MenuItem>
        <MenuItem>
       Maximum Word Count
           <input
            type="number"
            value={maxWordCount}
            onChange={(e) => setMaxWordCount(e.target.value)}
          />
        </MenuItem>
         <MenuItem>
          Minimum Character Count
          <input
            type="number"
            value={minCharacterCount}
            onChange={(e) => setMinCharacterCount(e.target.value)}
          />
        </MenuItem>
        <MenuItem>
       Maximum Character Count
           <input
            type="number"
            value={maxCharacterCount}
            onChange={(e) => setMaxCharacterCount(e.target.value)}
          />
        </MenuItem>
</Menu>
	</div>
);
}
export default React.forwardRef(DocumentInfo);