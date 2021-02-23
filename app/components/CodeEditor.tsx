import React, { useEffect, useRef, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';
import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
// import { Editor } from 'react-draft-wysiwyg';
import Editor from '@draft-js-plugins/editor';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import { useColorMode } from '@chakra-ui/react';
import { AccordionButton } from './CodeEditorButtons/AccordionButton';

const markdownShortcutPlugin = createMarkdownShortcutsPlugin();
const sideToolbarPlugin = createSideToolbarPlugin();
const codeEditorPlugin = createSideToolbarPlugin();
const plugins = [markdownShortcutPlugin, sideToolbarPlugin, codeEditorPlugin];

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
  console.log('filePath', filePath);
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
      onChange={onChange}
      plugins={plugins}
      // toolbarClassName="MDXCodeEditor_Toolbar"
      // wrapperClassName="MDXCodeEditor_Wrapper"
      // editorClassName="MDXCodeEditor"
      // toolbar={toolbarOptions}
      // toolbarCustomButtons={[<AccordionButton key="accordion" />]}
      // wrapperStyle={{
      //   position: 'relative',
      //   height: '100vh',
      // }}
      // editorStyle={{
      //   overflow: 'none !important',
      //   padding: '0 2em',
      //   ...editorStyles,
      // }}
      // toolbarStyle={toolbarStyles}
    />
  );
});

export default CodeEditor;
