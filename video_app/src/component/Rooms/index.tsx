import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {MainVideo} from "./MainVideo";
import {State} from "../../reducers";
import {VideoActions} from "../../actions/video";
import {SubVideos} from "./SubVideos";
import {RoomActions} from "../../actions/room";

import {RouteComponentProps} from 'react-router-dom'

type PageProps = {} & RouteComponentProps<{roomId: string}>;

export const Room: React.FC<PageProps> = (props) => {
    const { localVideoStream, remoteVideoStreams } = useSelector((state: State) => ({
        localVideoStream: state.video.localVideoStream,
        remoteVideoStreams: state.video.remoteVideoStreams,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({video: true, audio: true})
            .then((stream) => {
                const roomName = props.match.params.roomId;
                dispatch(RoomActions.joinRoom({localMediaStream: stream, roomName: roomName}))
            }).catch(err => console.log(err));

    }, []);


    return (
        <Wrapper>
            <RoomContainer>
                <MainVideoContainer>
                    <MainVideo stream={localVideoStream}></MainVideo>
                </MainVideoContainer>
                <SubVideosContainer>
                    <SubVideos streams={remoteVideoStreams}/>
                </SubVideosContainer>
                <Footer>ROOOM</Footer>
            </RoomContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  margin: 0;
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

