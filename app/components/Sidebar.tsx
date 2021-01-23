import React, { useEffect, useState } from 'react';
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
  Flex,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { useCurrentFile } from '../context/CurrentFileContext';

const generateFilePath = (folder, attempt) => {
  return path.join(__dirname, `./content/${folder}/new-${attempt}.mdx`);
};

const createFile = (folder = '') => {
  console.log('creating new file', folder);
  let filePath = path.join(__dirname, `./content/${folder}/new.mdx`);
  let attempts = 1;
  while (fs.existsSync(filePath)) {
    filePath = generateFilePath(folder, attempts);
    attempts += 1;
  }
  fs.writeFileSync(filePath, `# New Note`);
};

const CreateNewFile = ({ refreshSidebar }) => {
  const handleCreateFile = () => {
    createFile();
    refreshSidebar();
  };
  return (
    <Box
      as="button"
      type="button"
      width="100%"
      px={4}
      py={2}
      textAlign="left"
      onClick={handleCreateFile}
    >
      ➕ New Note
    </Box>
  );
};

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

const SidebarItemFolder = ({ file, folder, refreshSidebar }) => {
  const handleCreateFile = () => {
    console.log('folder', `${folder}${file.name}`);
    createFile(`${folder}${file.name}`);
    refreshSidebar();
  };
  const renderChildren = (child) => {
    return (
      <SidebarItem
        key={child.name}
        file={child}
        folder={`${folder}${file.name}/`}
        refreshSidebar={refreshSidebar}
      />
    );
  };
  return (
    <AccordionItem>
      <Flex px={4} py={2} alignContent="space-between">
        <Box flex="1" textAlign="left">
          {file.name}
        </Box>
        <Flex>
          <Box as="button" onClick={handleCreateFile}>
            ➕
          </Box>
          <AccordionButton width="auto" p={0}>
            <AccordionIcon />
          </AccordionButton>
        </Flex>
      </Flex>
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
      type="button"
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

const SidebarItem = ({ file, folder = '', refreshSidebar }) => {
  const { setCurrentFile } = useCurrentFile();
  const handleNavigation = () => {
    if (setCurrentFile)
      setCurrentFile((prevFile) => ({
        ...prevFile,
        name: `${folder}${file.name}`,
      }));
  };
  if (file.type === 'dir') {
    return (
      <SidebarItemFolder
        file={file}
        folder={folder}
        refreshSidebar={refreshSidebar}
      />
    );
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
  const [files, setFiles] = useState<File[] | never[]>([]);

  const refreshSidebar = () => {
    const newFiles: File[] = parseFolder();
    setFiles(newFiles);
  };

  useEffect(() => {
    refreshSidebar();
  }, [setFiles]);

  console.log('files', files);
  return (
    <Accordion
      width="200px"
      minHeight="100vh"
      position="relative"
      allowMultiple
      allowToggle
      borderRight="1px solid"
      borderColor="inherit"
    >
      {files.map((file) => (
        <SidebarItem
          key={file.name}
          file={file}
          refreshSidebar={refreshSidebar}
        />
      ))}
      <CreateNewFile refreshSidebar={refreshSidebar} />
      <DarkModeToggle />
    </Accordion>
  );
};

export default Sidebar;
