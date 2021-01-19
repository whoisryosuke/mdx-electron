import React, { useEffect, useRef, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useCurrentFileName } from '../context/CurrentFileContext';

interface Props {
  filename: string;
}

export const CodeEditor = React.memo(function CodeEditor({ filename }: Props) {
  const [code, setCode] = useState(EditorState.createEmpty());
  const filePath = path.join(__dirname, `./content/${filename}`);
  const loadedFile = useRef('');
  const onChange = (newValue) => {
    setCode(newValue);
    console.log('edited text', newValue.getCurrentContent());
    const rawContentState = convertToRaw(newValue.getCurrentContent());
    const markdownChanges = draftToMarkdown(rawContentState);
    console.log('saving markdown', markdownChanges);
    fs.writeFileSync(filePath, markdownChanges);
  };

  useEffect(() => {
    console.log('re-rendering code editor');
    if (filename && filename !== '' && loadedFile.current !== filename) {
      console.log('file isnt null', filename);
      let mdxFile;
      try {
        mdxFile = fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        console.error('failed to load file', e);
      } finally {
        const contentState = convertFromRaw(markdownToDraft(mdxFile));
        setCode(EditorState.createWithContent(contentState));
        console.log('loading from file');
        loadedFile.current = filename;
      }
    }
  }, [filename, filePath]);
  return (
    <Editor
      editorState={code}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onChange}
    />
  );
});

export default CodeEditor;
