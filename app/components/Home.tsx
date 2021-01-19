import React from 'react';
import styled from 'styled-components';
import Test from '../content/test.mdx';
import CodeEditor from './CodeEditor';
import PreviewErrorBoundary from './PreviewErrorBoundary';

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

const timestamp = Number(new Date()).toString(36);

export default function Home(): React.ReactNode {
  return (
    <Container>
      <ContentArea>
        <CodeEditor />
      </ContentArea>
      <ContentArea>
        <PreviewContainer>
          <PreviewErrorBoundary key={timestamp}>
            <Test />
          </PreviewErrorBoundary>
        </PreviewContainer>
      </ContentArea>
    </Container>
  );
}
