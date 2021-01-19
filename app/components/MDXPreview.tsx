import React from 'react';
import fs from 'fs';
import path from 'path';
import MDX from '@mdx-js/runtime';
import { UIComponents } from './MDXProvider';

interface Props {
  filename: string;
}

export const MDXPreview = ({ filename }: Props) => {
  if (filename && filename !== '') {
    const filePath = path.join(__dirname, `./content/${filename}`);
    const mdxText = fs.readFileSync(filePath, 'utf8');
    return <MDX components={UIComponents}>{mdxText}</MDX>;
  }
  return <div>Select a file from the sidebar</div>;
};

export default MDXPreview;
