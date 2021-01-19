import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useCurrentFileName } from '../context/CurrentFileContext';
import { CodeEditor } from './CodeEditor';
import { MDXPreview } from './MDXPreview';
import PreviewErrorBoundary from './PreviewErrorBoundary';
import { Sidebar } from './Sidebar';

export default function Home(): React.ReactNode {
  const [refreshKey, setRefreshKey] = useState('0');
  const filename = useCurrentFileName();
  const refreshPreview = () => {
    const timestamp = Number(new Date()).toString(36);
    setRefreshKey(timestamp);
  };
  return (
    <Flex>
      <Sidebar />
      <Box as="section" flex={1}>
        <CodeEditor filename={filename} refreshPreview={refreshPreview} />
      </Box>
      <Box as="section" flex={1}>
        <Box p={3}>
          <PreviewErrorBoundary key={refreshKey}>
            <MDXPreview filename={filename} />
          </PreviewErrorBoundary>
        </Box>
      </Box>
    </Flex>
  );
}
