import React from 'react';
import fs from 'fs';
import path from 'path';
import { Accordion, Box } from '@chakra-ui/react';
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
    <Box
      as="button"
      type="submit"
      px={4}
      py={2}
      flex="1"
      textAlign="left"
      onClick={handleNavigation}
    >
      {file.name}
    </Box>
  );
};

export const Sidebar = (props: Props) => {
  const filePath = path.join(__dirname, './content/');
  const files: File[] = fs.readdirSync(filePath, 'utf8').map((filename) => {
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
    <Accordion display="flex" flexDirection="column">
      {files.map((file) => (
        <SidebarItem key={file.name} file={file} />
      ))}
    </Accordion>
  );
};

export default Sidebar;
