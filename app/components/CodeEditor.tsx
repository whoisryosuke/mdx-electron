import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import draftToMarkdown from 'draftjs-to-markdown';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
import createUndoPlugin from '@draft-js-plugins/undo';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import '@draft-js-plugins/undo/lib/plugin.css';

const sideToolbarPlugin = createSideToolbarPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const linkifyPlugin = createLinkifyPlugin();
const undoPlugin = createUndoPlugin();
const markdownShortcutsPlugin = createMarkdownShortcutsPlugin();
const { SideToolbar } = sideToolbarPlugin;
const { UndoButton, RedoButton } = undoPlugin;

const plugins = [
  linkifyPlugin,
  sideToolbarPlugin,
  inlineToolbarPlugin,
  undoPlugin,
  markdownShortcutsPlugin,
];

interface Props {}

export const CodeEditor = (props: Props) => {
  const [code, setCode] = useState(EditorState.createEmpty());
  const filePath = path.join(__dirname, './content/test.mdx');
  const onChange = (newValue) => {
    setCode(newValue);
    console.log('edited text', newValue.getCurrentContent());
    const rawContentState = convertToRaw(newValue.getCurrentContent());
    console.log('raw content', rawContentState);
    if (rawContentState && rawContentState.blocks[0].text !== '') {
      const markup = draftToMarkdown(rawContentState);
      console.log('saving markdown', markup);
      fs.writeFileSync(filePath, markup);
    }
  };

  useEffect(() => {
    const mdxFile = fs.readFileSync(filePath, 'utf8');
    setCode(EditorState.createWithContent(stateFromMarkdown(mdxFile)));
    console.log('loading from file');
  }, []);

  return (
    <>
      <Editor editorState={code} onChange={onChange} plugins={plugins} />
      <SideToolbar />
      <UndoButton />
      <RedoButton />
    </>
  );
};

export default CodeEditor;
