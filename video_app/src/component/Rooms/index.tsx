import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {MainVideo} from "./MainVideo";
import {State} from "../../reducers";
import {SubVideos} from "./SubVideos";
import {RoomActions} from "../../actions/room";

import {RouteComponentProps} from 'react-router-dom'
import {PreparationVideo} from "./PreparationVideo";
import {VideoActions} from "../../actions/video";

type PageProps = {} & RouteComponentProps<{roomId: string}>;

export const Room: React.FC<PageProps> = (props) => {
    const { preparationVideoStream, mainVideoStream, subVideoStreams, isInTheRoom } = useSelector((state: State) => ({
        preparationVideoStream: state.video.preparationVideoStream,
        mainVideoStream: state.video.mainVideoStream,
        subVideoStreams: state.video.subVideoStreams,
        isInTheRoom: state.room.isInTheRoom,
    }));

    const sessionToken = "SESSION_TOKEN";
    const dispatch = useDispatch();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({video: true, audio: true})
            .then((stream: MediaStream) => {
                dispatch(VideoActions.localVideoStreamAdded(stream));
            }).catch(err => console.log(err));
    }, [MediaStream]);

    const joinRoomButtonClicked = () => {
        dispatch(RoomActions.joinRoomButtonClicked({sessionToken: sessionToken, roomName: props.match.params.roomId}))
    };

    return (
        <Wrapper>
            {!isInTheRoom &&
            <PreparationRoomContainer>
                <PreparationVideoContainer>
                  {preparationVideoStream &&
                  <PreparationVideo stream={preparationVideoStream}></PreparationVideo>
                  }
                </PreparationVideoContainer>
                <SettingsContainer>
                  <UserName>Tenny the Winning Eleven SUPER LOSER</UserName>
                  <JoinButton onClick={joinRoomButtonClicked}>オンライン面接に今すぐ参加する</JoinButton>
                </SettingsContainer>
            </PreparationRoomContainer>
            }

            {isInTheRoom &&
            <RoomContainer>
              <MainVideoContainer>
                  {mainVideoStream &&
                  <MainVideo stream={mainVideoStream}></MainVideo>
                  }
              </MainVideoContainer>
              <SubVideosContainer>
                  {subVideoStreams &&
                  <SubVideos streams={subVideoStreams}/>
                  }
              </SubVideosContainer>
              <Footer>ROOOM</Footer>
            </RoomContainer>
            }
        </Wrapper>
    );
};

const Wrapper = styled.div`
  margin: 0;
`;

const PreparationRoomContainer = styled.div`
  display: grid;
  grid-template-rows: 100vh;
  grid-template-columns: 2fr 4fr 3fr 2fr;
  grid-template-areas:
        ". preparationVideoContainerArea settingsContainerArea ."
        ". preparationVideoContainerArea settingsContainerArea ."; 
`;

const PreparationVideoContainer = styled.div`
  text-align: center;
  grid-area: preparationVideoContainerArea;
  padding: 20vh 32px;
`;


const SettingsContainer = styled.div`
  text-align: center;
  grid-area: settingsContainerArea;
  padding: 20vh 0;
`;

const UserName = styled.div`
  font-size: 32px;
  display: block;
  font-weight: bold;
`;

const JoinButton = styled.button`
　margin-top: 30px;
　display: inline-block;
  background-color: #1976D2;/*背景色*/
  color: #FFF;/*文字色*/
  font-size: 20px;/*文字サイズ*/
  line-height: 1;
  text-decoration: none;
  letter-spacing: 0.05em;/*字間*/
  padding: 0.2em 1em;/*ボタン内の余白*/
  border-radius: 8px;/*角の丸み*/
    cursor: pointer;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);/*影*/
  -webkit-tap-highlight-color: transparent;
  transition: .3s ease-out;/*変化を緩やかに*/
  &:hover{
    box-shadow: 0 3px 3px 0 rgba(0,0,0,0.14), 0 1px 7px 0 rgba(0,0,0,0.12), 0 3px 1px -1px rgba(0,0,0,0.2);/*浮き上がるように*/
  }
`;






const RoomContainer = styled.div`
  display: grid;
  grid-template-rows: 60vh 25vh;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
        "mainVideoContainerArea subVideosContainerArea"
        ". subVideosContainerArea";
`;

const MainVideoContainer = styled.div`
  grid-area: mainVideoContainerArea;
`;

const SubVideosContainer = styled.div`
  grid-area: subVideosContainerArea;
  background: #8f8;
`;

const Footer = styled.div`
  position:fixed;
  left:0px;
  bottom:0px;
  height:10vh;
  width:100%;
  background:#f8f9fa;
`;

