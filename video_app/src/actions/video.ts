import actionCreatorFactory from 'typescript-fsa';
import {RoomStream} from "skyway-js";
import {VideoMedia} from "../models/videoMedia";

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<VideoMedia>('reducerSetLocalVideoStream'),
    reducerSetLocalShareScreenStream: actionCreator<VideoMedia>('reducerSetLocalShareScreenStream'),
    reducerRemoveLocalShareScreenStream: actionCreator<string>('reducerRemoveLocalShareScreenStream'),
    reducerSetPreparationVideoStream: actionCreator<VideoMedia>('reducerSetPreparationVideoStream'),
    reducerSetRemoteVideoStream: actionCreator<VideoMedia>('reducerSetRemoteVideoStream'),
    reducerSetRemoteVideoStreams: actionCreator<VideoMedia[]>('reducerSetRemoteVideoStreams'),
    reducerSetMainVideoStream: actionCreator<VideoMedia>('reducerSetMainVideoStream'),
    reducerSetSubVideoStreams: actionCreator<VideoMedia[]>('reducerSetSubVideoStreams'),
    localVideoStreamAdded: actionCreator<MediaStream>('localVideoStreamAdded'),
    remoteVideoStreamAdded: actionCreator<RoomStream>('remoteVideoStreamAdded'),
    remoteVideoStreamRemoved: actionCreator<string>('remoteVideoStreamRemoved'),
    shareScreenButtonClicked: actionCreator<MediaStream>('shareScreenButtonClicked'),
    localShareScreenEnded: actionCreator<string>('localShareScreenEnded'),
};
