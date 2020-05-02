import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { Path } from '../routes';
import {GoogleBooksActions} from "../actions/googleBooks";
import { useDispatch, useSelector } from 'react-redux';
import {RoomActions} from "../actions/room";
import {State} from "../reducers";


const App: React.FC = () => {

    const dispatch = useDispatch();

    const { roomUrl } = useSelector((state: State) => ({
        roomUrl: state.room.roomUrl,
    }));

    return (
        <>
            <GlobalStyle />

            <Wrapper>
                <Header>
                    <CreateRoomButton
                        onClick={event => {
                            event.preventDefault();
                            dispatch(RoomActions.getRoomUrl({peerId: `peerID_${Math.floor((Math.random() * 100) + 1)}`, sessionToken: "gaga"}))
                        }}
                    >
                        オンライン面接用のURLを発行する
                        {roomUrl}
                    </CreateRoomButton>
                    {/*<OtameshiLink to={Path.otameshi}>お試しページへのリンク</OtameshiLink>*/}
                </Header>
            </Wrapper>
        </>
    );
};

const GlobalStyle = createGlobalStyle`
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
  text-align: center;
`;

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const Logo = styled.img`
  height: 40vmin;
`;

const OfficialLink = styled.a`
  color: #09d3ac;
`;

const OtameshiLink = styled(Link)`
  color: #fff;
  margin-top: 30px;
`;

const CreateRoomButton = styled.button`
  color: #fff;
  background-color: #1E90FF;
  border-radius: 3px;
  margin-left: 10px;
  padding: 10px;
  font-size: 18px;
  border: none;
  outline: none;
  transition: 0.4s;
  cursor: pointer;
  &:disabled {
    background-color: #bfbfbf;
    cursor: not-allowed;
  }
`;


const Text = styled.p``;

const CodeText = styled.code``;

export default App;
