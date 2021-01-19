import React from 'react';
import fs from 'fs';
import path from 'path';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { useCurrentFile } from '../context/CurrentFileContext';

const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      position="absolute"
      bottom={3}
      left={3}
      borderRadius={999}
      icon={
        <Box width="17px" textAlign="center">
          {colorMode === 'light' ? '⚫️' : '⚪️'}
        </Box>
      }
    />
  );
};

interface Props {}

type File = {
  name: string;
  children: File[] | never[];
  type: 'file' | 'dir';
};

const SidebarItemFolder = ({ file, folder }) => {
  const renderChildren = (child) => {
    return (
      <SidebarItem
        key={child.name}
        file={child}
        folder={`${folder}${file.name}/`}
      />
    );
  };
  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          {file.name}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pr={0} pb={4}>
        {file.children?.map(renderChildren)}
      </AccordionPanel>
    </AccordionItem>
  );
};

const SidebarItemFile = ({ file, handleNavigation }) => {
  return (
    <Box
      as="button"
      type="submit"
      width="100%"
      px={4}
      py={2}
      textAlign="left"
      onClick={handleNavigation}
    >
      {file.name}
    </Box>
  );
};

const SidebarItem = ({ file, folder = '' }) => {
  const { setCurrentFile } = useCurrentFile();
  const handleNavigation = () => {
    if (setCurrentFile)
      setCurrentFile((prevFile) => ({
        ...prevFile,
        name: `${folder}${file.name}`,
      }));
  };
  if (file.type === 'dir') {
    return <SidebarItemFolder file={file} folder={folder} />;
  }
  return <SidebarItemFile file={file} handleNavigation={handleNavigation} />;
};

const parseFolder = (folder = '', parentFolder = '') => {
  const parseFile = (filename, prevFolder) => {
    const filePathName = path.join(__dirname, `${prevFolder}/${filename}`);
    // Check if folder, recursively run this command and set as children
    let children = [];
    if (fs.lstatSync(filePathName).isDirectory()) {
      children = parseFolder(filename, prevFolder);
      return {
        name: filename,
        type: 'dir',
        children,
      };
    }

    // Check if MDX file
    if (path.extname(filename) === '.mdx') {
      // Create data object to render into a component
      return {
        name: filename,
        type: 'file',
      };
    }
  };

  const parentPath = parentFolder !== '' ? parentFolder : './content';
  const combinedFolderPath = `${parentPath}/${folder}`;
  const folderPath = path.join(__dirname, combinedFolderPath);
  const files: File[] = fs
    .readdirSync(folderPath, 'utf8')
    .map((file) => parseFile(file, combinedFolderPath));
  return files;
};

export const Sidebar = (props: Props) => {
  const files: File[] = parseFolder();
  console.log('files', files);
  return (
    <Accordion
      width="200px"
      minHeight="100vh"
      position="relative"
      allowMultiple
      allowToggle
    >
      {files.map((file) => (
        <SidebarItem key={file.name} file={file} />
      ))}
      <DarkModeToggle />
    </Accordion>
  );
};

export default Sidebar;
