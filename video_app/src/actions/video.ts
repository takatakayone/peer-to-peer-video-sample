import actionCreatorFactory from 'typescript-fsa';
import {RoomStream} from "skyway-js";

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<MediaStream>('reducerSetLocalVideoStream'),
    reducerSetPreparationVideoStream: actionCreator<MediaStream>('reducerSetPreparationVideoStream'),
    reducerSetRemoteVideoStream: actionCreator<RoomStream>('reducerSetRemoteVideoStream'),
    reducerSetMainVideoStream: actionCreator<MediaStream>('reducerSetMainVideoStream'),
    reducerSetSubVideoStream: actionCreator<MediaStream>('reducerSetSubVideoStream'),
    localVideoStreamAdded: actionCreator<MediaStream>('localVideoStreamAdded'),
    remoteVideoStreamAdded: actionCreator<RoomStream>('remoteVideoStreamAdded'),
    remoteVideoStreamRemoved: actionCreator<string>('remoteVideoStreamRemoved'),
};
