import React, { useEffect, useRef, useState } from 'react';
import fs from 'fs';
import path from 'path';
import Editor, { loader } from '@monaco-editor/react';
import { Box, Button, useColorMode } from '@chakra-ui/react';
import nightOwl from 'monaco-themes/themes/Night Owl.json';

const COMPONENT_TEMPLATE = {
  accordion: `
<Accordion allowToggle>
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" textAlign="left">
        Section 1 title
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
</Accordion>`,
  accordionItem: `
<AccordionItem>
  <AccordionButton>
    <Box flex="1" textAlign="left">
      Section 2 title
    </Box>
    <AccordionIcon />
  </AccordionButton>
  <AccordionPanel pb={4}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat.
  </AccordionPanel>
</AccordionItem>`,
};

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
  const { colorMode, toggleColorMode } = useColorMode();
  const filePath = path.join(__dirname, `./content/${filename}`);
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

  const addComponent = ({ currentTarget }) => {
    const currentCode = code;
    console.log('pressed', currentTarget.name);
    const addedComponent = `${code}${COMPONENT_TEMPLATE[currentTarget.name]}`;
    onChange(addedComponent);
  };

  const editorTheme = colorMode === 'light' ? 'vs' : 'vs-dark';

  return (
    <>
      <Box>
        <Button name="accordion" onClick={addComponent}>
          Accordion
        </Button>
        <Button name="accordionItem" onClick={addComponent}>
          Accordion Item
        </Button>
      </Box>
      <Editor
        height="100vh"
        paddingTop="150px"
        defaultLanguage="markdown"
        language="markdown"
        theme={editorTheme}
        value={code}
        line={0}
        onChange={onChange}
        beforeMount={handleEditorWillMount}
        options={{
          fontFamily: 'FiraCode',
          fontSize: 14,
          wordWrap: 'on',
          minimap: {
            enabled: false,
          },
        }}
      />
    </>
  );
});

export default CodeEditor;
