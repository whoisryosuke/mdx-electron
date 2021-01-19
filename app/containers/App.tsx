import React, { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { MDXProvider } from '@mdx-js/react';
import { UIComponents } from '../components/MDXProvider';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return <ChakraProvider>{children}</ChakraProvider>;
}
