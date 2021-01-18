import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import draftToMarkdown from 'draftjs-to-markdown';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface Props {}

export const CodeEditor = (props: Props) => {
  const [code, setCode] = useState(EditorState.createEmpty());
  const filePath = path.join(__dirname, './content/test.mdx');
  const onChange = (newValue) => {
    setCode(newValue);
    console.log('edited text', newValue.getCurrentContent());
    const rawContentState = convertToRaw(newValue.getCurrentContent());
    const markup = draftToMarkdown(rawContentState);
    console.log('saving markdown', markup);
    fs.writeFileSync(filePath, markup);
  };

  useEffect(() => {
    const mdxFile = fs.readFileSync(filePath, 'utf8');
    setCode(EditorState.createWithContent(stateFromMarkdown(mdxFile)));
    console.log('loading from file');
  }, []);
  return (
    <Editor
      editorState={code}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onChange}
    />
  );
};

export default CodeEditor;
