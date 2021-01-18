import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
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
    const markdownChanges = draftToMarkdown(rawContentState);
    console.log('saving markdown', markdownChanges);
    fs.writeFileSync(filePath, markdownChanges);
  };

  useEffect(() => {
    const mdxFile = fs.readFileSync(filePath, 'utf8');
    const contentState = convertFromRaw(markdownToDraft(mdxFile));
    setCode(EditorState.createWithContent(contentState));
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
