import React from 'react';
import { Link } from 'react-router-dom';
import fs from 'fs';
import { exec } from 'child_process';
import styled from 'styled-components';
import routes from '../constants/routes.json';
import styles from './Home.css';
import Test from '../content/test.mdx';

const Header = styled.h2`
  color: red;
`;

export default function Home(): React.ReactNode {
  // exec('ls -la', (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.log(`stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });
  console.log('mdx', Test);
  return (
    <div className={styles.container} data-tid="container">
      <Header>Home</Header>
      <Link to={routes.COUNTER}>to Counter</Link>
      <Test />
    </div>
  );
}
