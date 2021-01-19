import React from 'react';
import Home from '../components/Home';
import { CurrentFileProvider } from '../context/CurrentFileContext';

export default function HomePage() {
  return (
    <CurrentFileProvider>
      <Home />
    </CurrentFileProvider>
  );
}
