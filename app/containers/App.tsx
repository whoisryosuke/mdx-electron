import React, { ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { UIComponents } from '../components/MDXProvider';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return <MDXProvider components={UIComponents}>{children}</MDXProvider>;
}
