import { ColorModeScript } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider, theme } from '../components/ThemeProvider';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return (
    <ThemeProvider>
      <Helmet>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </Helmet>
      {children}
    </ThemeProvider>
  );
}
