import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import AceEditor from 'react-ace';

// Needed for snippets, autocomplete, etc
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-github';

interface Props {}

export const CodeEditor = (props: Props) => {
  const [code, setCode] = useState('');
  const filePath = path.join(__dirname, './content/test.mdx');
  const onChange = (newValue) => {
    setCode(newValue);
    fs.writeFileSync(filePath, newValue);
  };

  useEffect(() => {
    const mdxFile = fs.readFileSync(filePath, 'utf8');
    setCode(mdxFile);
  }, [setCode, filePath]);
  return (
    <AceEditor
      mode="markdown"
      theme="github"
      onChange={onChange}
      name="code-editor"
      value={code}
      editorProps={{ $blockScrolling: true }}
      enableBasicAutocompletion
      enableLiveAutocompletion
    />
  );
};

export default CodeEditor;
