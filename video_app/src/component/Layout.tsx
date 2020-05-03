import React from 'react';
import styled, { createGlobalStyle } from "styled-components";
import { Reset } from 'styled-reset';

export const Layout: React.FC = ({ children }) => {
  return(
      <>
          <Reset />
          <GlobalStyle />

          <Wrapper>
              <Header>Web Conference</Header>
              <Body>{children}</Body>
          </Wrapper>
      </>
  )
};


const GlobalStyle = createGlobalStyle`
   html, body{
   overflow: hidden;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const Wrapper = styled.div`
    height: 100%;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    height: 5vh;
    color: #fff;
    background-color: #1E90FF;
    font-size: 20px;
    font-weight: bold;
    padding: 0 20px;
`;

const Body = styled.div`
    margin: 0 -8px;
    height: calc(100vh - 60px);
`;
