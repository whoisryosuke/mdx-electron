import React, { useEffect, useRef, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useColorMode } from '@chakra-ui/react';
import { AccordionButton } from './CodeEditorButtons/AccordionButton';

interface Props {
  filename: string;
  refreshPreview: () => void;
}

const toolbarOptions = {
  options: [
    'inline',
    'blockType',
    // 'fontSize',
    // 'fontFamily',
    'list',
    // 'textAlign',
    // 'colorPicker',
    'link',
    'embedded',
    'emoji',
    'image',
    'remove',
    'history',
  ],
};

export const CodeEditor = React.memo(function CodeEditor({
  filename,
  refreshPreview,
}: Props) {
  const [code, setCode] = useState(EditorState.createEmpty());
  const { colorMode, toggleColorMode } = useColorMode();
  const filePath = path.join(__dirname, `./content/${filename}`);
  const loadedFile = useRef('');
  const onChange = (newValue) => {
    setCode(newValue);
    const rawContentState = convertToRaw(newValue.getCurrentContent());
    const markdownChanges = draftToMarkdown(rawContentState);
    fs.writeFileSync(filePath, markdownChanges);
    refreshPreview();
  };

  useEffect(() => {
    if (filename && filename !== '' && loadedFile.current !== filename) {
      let mdxFile;
      try {
        mdxFile = fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        console.error('failed to load file', e);
      } finally {
        const contentState = convertFromRaw(markdownToDraft(mdxFile));
        setCode(EditorState.createWithContent(contentState));
        loadedFile.current = filename;
      }
    }
  }, [filename, filePath]);

  const editorStyles =
    colorMode === 'dark'
      ? {
          fontColor: 'rgba(255, 255, 255, 0.92)',
        }
      : {};
  const toolbarStyles =
    colorMode === 'dark'
      ? {
          backgroundColor: '#1A202C',
          borderColor: '#1A202C',
        }
      : {};
  return (
    <Editor
      editorState={code}
      toolbarClassName="MDXCodeEditor_Toolbar"
      wrapperClassName="MDXCodeEditor_Wrapper"
      editorClassName="MDXCodeEditor"
      onEditorStateChange={onChange}
      toolbar={toolbarOptions}
      toolbarCustomButtons={[<AccordionButton key="accordion" />]}
      editorStyle={editorStyles}
      toolbarStyle={toolbarStyles}
    />
  );
});

export default CodeEditor;
