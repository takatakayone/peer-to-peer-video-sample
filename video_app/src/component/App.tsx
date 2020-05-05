import React, {useState} from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {RoomActions} from "../actions/room";
import {State} from "../reducers";


const App: React.FC = () => {

    const dispatch = useDispatch();

    const [isModalOpen, toggleModal] = useState(false);

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
                            dispatch(RoomActions.createRoom({peerId: `${Math.floor((Math.random() * 100000000) + 1)}`, sessionToken: "gaga"}))
                            toggleModal(true)
                        }}
                    >
                        オンライン面接用のURLを発行する
                    </CreateRoomButton>
                    <Mask style={{display: isModalOpen ? "block" : "none"}}/>
                    <Modal style={{display: isModalOpen ? "block" : "none"}}>
                        <ModalContent>こちらがオンライン面接用のURLです</ModalContent>
                        <RoomLink to={`rooms/${roomUrl}`}>http://localhost:3333/rooms/{roomUrl}</RoomLink>
                        <CloseModal
                            onClick={event => {
                                event.preventDefault();
                                toggleModal(false)
                            }}
                        >
                            閉じる
                        </CloseModal>
                    </Modal>
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

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
`;

const Modal = styled.section`
  background: #fff;
  color: #555;
  width: 300px;
  padding: 40px;
  border-radius: 4px;
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 2;
`;

const ModalContent = styled.p`
  margin: 0 0 20px;
  font-size: 16px;
`;

const RoomLink = styled(Link)`
  font-size: 16px;
  margin-top: 30px;
`;

const CloseModal = styled.div`
　font-size: 16px;
  cursor: pointer;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  padding: 12px;
  margin: 16px auto 0;
  background: #1E90FF;
  color: white;
`;


export default App;
