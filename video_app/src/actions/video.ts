import actionCreatorFactory from 'typescript-fsa';
import {RoomStream} from "skyway-js";

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<RoomStream>('reducerSetLocalVideoStream'),
    reducerSetRemoteVideoStream: actionCreator<RoomStream>('reducerSetRemoteVideoStream'),
    reducerSetMainVideoStream: actionCreator<MediaStream>('reducerSetMainVideoStream'),
    reducerSetSubVideoStream: actionCreator<MediaStream>('reducerSetSubVideoStream'),
    videoStreamAdded: actionCreator<MediaStream>('videoStreamAdded'),
    remoteVideoStreamAdded: actionCreator<RoomStream>('remoteVideoStreamAdded'),
    remoteVideoStreamRemoved: actionCreator<string>('remoteVideoStreamRemoved'),
};
