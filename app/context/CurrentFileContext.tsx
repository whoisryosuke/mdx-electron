import React, { createContext, useContext, useState } from 'react';

export type CurrentFileStructure = {
  name: string;
  icon: string;
};

export type CurrentFileContextStructure = {
  currentFile?: CurrentFileStructure;
  setCurrentFile?: React.Dispatch<React.SetStateAction<CurrentFileStructure>>;
};

export const CurrentFileContext = createContext<CurrentFileContextStructure>(
  {}
);
type CurrentFileProviderProps = {
  children: React.ReactNode;
};
export const CurrentFileProvider = ({ children }: CurrentFileProviderProps) => {
  const [currentFile, setCurrentFile] = useState({
    name: '',
  });
  return (
    <CurrentFileContext.Provider value={{ currentFile, setCurrentFile }}>
      {children}
    </CurrentFileContext.Provider>
  );
};
export const useCurrentFile = () => useContext(CurrentFileContext);
export const useCurrentFileName = () => {
  const { currentFile } = useContext(CurrentFileContext);
  return currentFile?.name;
};
