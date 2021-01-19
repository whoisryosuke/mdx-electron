import React, { useEffect, useRef, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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
  return (
    <Editor
      editorState={code}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onChange}
      toolbar={toolbarOptions}
    />
  );
});

export default CodeEditor;
