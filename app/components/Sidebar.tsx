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
  Input,
  useColorMode,
} from '@chakra-ui/react';
import { useCurrentFile } from '../context/CurrentFileContext';
import useKeyPress from '../hooks/useKeyPress';

const generateFilePath = (folder, attempt) => {
  return path.join(__dirname, `./content/${folder}/new-${attempt}.mdx`);
};

const renameFile = (oldName, folder, newName) => {
  const oldPath = path.join(__dirname, `./content/${folder}${oldName}`);
  const newPath = path.join(__dirname, `./content/${folder}${newName}`);
  try {
    fs.renameSync(oldPath, newPath);
  } catch (error) {
    console.warn(`Couldn't rename file`, error);
  }
};

const createFile = (folder = '') => {
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

const RenameInput = ({ name, folder, toggleRename, refreshSidebar }) => {
  const [folderName, setFolderName] = useState(name);
  const handleFolderName = (event) => setFolderName(event.target.value);
  const { currentFile, setCurrentFile } = useCurrentFile();

  const handleRename = () => {
    renameFile(name, folder, folderName);
    // Check if current file is renamed file
    // If so, make sure to update current file
    if (setCurrentFile && currentFile.name === `${folder}${name}`) {
      setCurrentFile((prevFile) => ({
        ...prevFile,
        name: `${folder}${folderName}`,
      }));
    }
    // Turn off input in sidebar
    toggleRename();
    // Force sidebar to refresh with new name
    refreshSidebar();
  };

  useKeyPress('Enter', handleRename);
  return <Input value={folderName} onChange={handleFolderName} />;
};

interface Props {}

type File = {
  name: string;
  children: File[] | never[];
  type: 'file' | 'dir';
};

const SidebarItemFolder = ({ file, folder, refreshSidebar }) => {
  const [rename, setRename] = useState(false);
  const toggleRename = () => setRename((prevRename) => !prevRename);

  const handleCreateFile = () => {
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
        {rename ? (
          <RenameInput
            name={file.name}
            folder={folder}
            toggleRename={toggleRename}
            refreshSidebar={refreshSidebar}
          />
        ) : (
          <Box flex="1" textAlign="left" onClick={toggleRename}>
            {file.name}
          </Box>
        )}
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

const SidebarItemFile = ({
  file,
  folder,
  refreshSidebar,
  handleNavigation,
}) => {
  const [rename, setRename] = useState(false);
  const toggleRename = () => setRename((prevRename) => !prevRename);

  if (rename) {
    return (
      <RenameInput
        name={file.name}
        folder={folder}
        toggleRename={toggleRename}
        refreshSidebar={refreshSidebar}
      />
    );
  }
  return (
    <Box
      as="button"
      type="button"
      width="100%"
      px={4}
      py={2}
      textAlign="left"
      display="flex"
      justifyContent="space-between"
      onClick={handleNavigation}
    >
      {file.name}
      <Box as="button" onClick={toggleRename}>
        ...
      </Box>
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
  return (
    <SidebarItemFile
      file={file}
      folder={folder}
      handleNavigation={handleNavigation}
      refreshSidebar={refreshSidebar}
    />
  );
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
