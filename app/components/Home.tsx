import React from 'react';
import styled from 'styled-components';
import Test from '../content/test.mdx';
import { useCurrentFileName } from '../context/CurrentFileContext';
import CodeEditor from './CodeEditor';
import { MDXPreview } from './MDXPreview';
import PreviewErrorBoundary from './PreviewErrorBoundary';
import { Sidebar } from './Sidebar';

const Container = styled.section`
  display: flex;
  flex-direction: row;
`;

const ContentArea = styled.section`
  position: relative;
  flex: 1;
`;

const PreviewContainer = styled.div`
  padding: 3em;
`;

export default function Home(): React.ReactNode {
  const filename = useCurrentFileName();
  const timestamp = Number(new Date()).toString(36);
  return (
    <Container>
      <Sidebar />
      <ContentArea>
        <CodeEditor filename={filename} />
      </ContentArea>
      <ContentArea>
        <PreviewContainer>
          <PreviewErrorBoundary key={timestamp}>
            <MDXPreview filename={filename} />
          </PreviewErrorBoundary>
        </PreviewContainer>
      </ContentArea>
    </Container>
  );
}
