import React from 'react';
import fs from 'fs';
import path from 'path';
import styled from 'styled-components';
import Test from '../content/test.mdx';
import CodeEditor from './CodeEditor';

const Container = styled.section`
  display: flex;
  flex-direction: row;
`;

const ContentArea = styled.section`
  position: relative;
  flex: 1;
`;

export default function Home(): React.ReactNode {
  const filePath = path.join(__dirname, './content/test.mdx');
  const mdxFile = fs.readFileSync(filePath, 'utf8');
  return (
    <Container>
      <ContentArea>
        <CodeEditor />
      </ContentArea>
      <ContentArea>
        <Test />
      </ContentArea>
    </Container>
  );
}
