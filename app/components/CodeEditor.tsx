import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface Props {}

export const CodeEditor = (props: Props) => {
  const [code, setCode] = useState(EditorState.createEmpty());
  const filePath = path.join(__dirname, './content/test.mdx');
  const onChange = (newValue) => {
    setCode(newValue);
    console.log('edited text', newValue);
    // fs.writeFileSync(filePath, newValue);
  };

  useEffect(() => {
    const mdxFile = fs.readFileSync(filePath, 'utf8');
    setCode(
      EditorState.createWithContent(ContentState.createFromText(mdxFile))
    );
  }, [setCode, filePath]);
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
