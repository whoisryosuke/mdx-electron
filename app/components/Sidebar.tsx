import React from 'react';
import fs from 'fs';
import path from 'path';
import { useCurrentFile } from '../context/CurrentFileContext';

interface Props {}

type File = {
  name: string;
  children: File[] | never[];
};

const SidebarItem = ({ file }) => {
  const { setCurrentFile } = useCurrentFile();
  const handleNavigation = () => {
    if (setCurrentFile)
      setCurrentFile((prevFile) => ({ ...prevFile, name: file.name }));
  };
  return (
    <button type="button" onClick={handleNavigation}>
      {file.name}
    </button>
  );
};

export const Sidebar = (props: Props) => {
  const filePath = path.join(__dirname, './content/');
  const files: File[] = fs.readdirSync(filePath, 'utf8').map((filename) => {
    console.log('got file', filename);
    // Check if folder, recursively run this command and set as children
    const children = [];
    // if(fs.lstatSync(filename).isDirectory()) {
    // children = runAgain
    // }

    // Check if MDX file
    if (path.extname(filename) === '.mdx') {
      // Create data object to render into a component
      return {
        name: filename,
        children,
      };
    }
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {files.map((file) => (
        <SidebarItem key={file.name} file={file} />
      ))}
    </div>
  );
};

export default Sidebar;
