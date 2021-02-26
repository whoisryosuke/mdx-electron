import React from 'react';
import fs from 'fs';
import path from 'path';
import MDX from '@mdx-js/runtime';
import matter from 'gray-matter';
import { UIComponents } from './MDXProvider';
import { useCurrentFile } from '../context/CurrentFileContext';

interface Props {
  filename: string;
}

export const MDXPreview = ({ filename }: Props) => {
  const { currentFile, setCurrentFile } = useCurrentFile();
  if (filename && filename !== '') {
    const filePath = path.join(__dirname, `./content/${filename}`);
    const mdxText = fs.readFileSync(filePath, 'utf8');
    // Parse frontmatter and grab content vs metadata
    const mdxProcessed = matter(mdxText);
    // Set icon in current file if it doesn't exist in context
    if (currentFile?.icon !== mdxProcessed?.data?.icon) {
      if (setCurrentFile)
        setCurrentFile((prevFile) => ({
          ...prevFile,
          icon: mdxProcessed.data.icon,
        }));
    }

    // // Check for frontmatter
    // if (mdxText.substring(0, 3) === '---') {
    //   // Remove frontmatter
    //   mdxClean = mdxText.replace(/---(.|\n)*?---/, '');
    // }
    return <MDX components={UIComponents}>{mdxProcessed.content}</MDX>;
  }
  return <div>Select a file from the sidebar</div>;
};

export default MDXPreview;
