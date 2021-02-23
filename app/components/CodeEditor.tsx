import React, { useEffect, useRef, useState } from 'react';
import fs from 'fs';
import path from 'path';
import Editor, { loader } from '@monaco-editor/react';
import { useColorMode } from '@chakra-ui/react';
import nightOwl from 'monaco-themes/themes/Night Owl.json';

function ensureFirstBackSlash(str) {
  return str.length > 0 && str.charAt(0) !== '/' ? `/${str}` : str;
}

function uriFromPath(_path) {
  const pathName = path.resolve(_path).replace(/\\/g, '/');
  return encodeURI(`file://${ensureFirstBackSlash(pathName)}`);
}

loader.config({
  paths: {
    vs: uriFromPath(
      path.join(__dirname, '../node_modules/monaco-editor/min/vs')
    ),
  },
});

interface Props {
  filename: string;
  refreshPreview: () => void;
}

export const CodeEditor = React.memo(function CodeEditor({
  filename,
  refreshPreview,
}: Props) {
  const [code, setCode] = useState('# Hello MDX!');
  // const { colorMode, toggleColorMode } = useColorMode();
  const filePath = path.join(__dirname, `./content/${filename}`);
  console.log('filePath', filePath);
  const loadedFile = useRef('');
  const onChange = (newValue) => {
    setCode(newValue);
    fs.writeFileSync(filePath, newValue);
    refreshPreview();
  };

  function handleEditorWillMount(monaco) {
    // Add themes
    monaco.editor.defineTheme('night-owl', nightOwl);
  }

  useEffect(() => {
    if (filename && filename !== '' && loadedFile.current !== filename) {
      let mdxFile;
      try {
        mdxFile = fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        console.error('failed to load file', e);
      } finally {
        setCode(mdxFile);
        loadedFile.current = filename;
      }
    }
  }, [filename, filePath]);

  console.log('the code', code);

  return (
    <Editor
      height="90vh"
      defaultLanguage="markdown"
      language="markdown"
      theme="vs-dark"
      value={code}
      line={0}
      onChange={onChange}
      beforeMount={handleEditorWillMount}
      options={{
        fontFamily: 'FiraCode',
      }}
    />
  );
});

export default CodeEditor;
