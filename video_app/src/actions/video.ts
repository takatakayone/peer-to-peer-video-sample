import actionCreatorFactory from 'typescript-fsa';
import {RoomStream} from "skyway-js";
import {VideoMedia} from "../models/videoMedia";

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<VideoMedia>('reducerSetLocalVideoStream'),
    reducerSetPreparationVideoStream: actionCreator<VideoMedia>('reducerSetPreparationVideoStream'),
    reducerSetRemoteVideoStream: actionCreator<RoomStream>('reducerSetRemoteVideoStream'),
    reducerSetRemoteVideoStreams: actionCreator<RoomStream[]>('reducerSetRemoteVideoStreams'),
    reducerSetMainVideoStream: actionCreator<MediaStream>('reducerSetMainVideoStream'),
    reducerSetSubVideoStreams: actionCreator<MediaStream[]>('reducerSetSubVideoStreams'),
    localVideoStreamAdded: actionCreator<MediaStream>('localVideoStreamAdded'),
    remoteVideoStreamAdded: actionCreator<RoomStream>('remoteVideoStreamAdded'),
    remoteVideoStreamRemoved: actionCreator<string>('remoteVideoStreamRemoved'),
};
