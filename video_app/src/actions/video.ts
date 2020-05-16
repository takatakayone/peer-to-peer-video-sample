import actionCreatorFactory from 'typescript-fsa';
import {RoomStream} from "skyway-js";
import {VideoMedia} from "../models/videoMedia";

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<VideoMedia>('reducerSetLocalVideoStream'),
    reducerSetPreparationVideoStream: actionCreator<VideoMedia>('reducerSetPreparationVideoStream'),
    reducerSetRemoteVideoStream: actionCreator<VideoMedia>('reducerSetRemoteVideoStream'),
    reducerSetRemoteVideoStreams: actionCreator<VideoMedia[]>('reducerSetRemoteVideoStreams'),
    reducerSetLocalShareScreenVideoStream: actionCreator<VideoMedia>('reducerSetLocalShareScreenVideoStream'),
    reducerRemoveLocalShareScreenVideoStream: actionCreator<MediaStream>('reducerRemoveLocalShareScreenVideoStream'),
    reducerSetMainVideoStream: actionCreator<VideoMedia>('reducerSetMainVideoStream'),
    reducerSetSubVideoStreams: actionCreator<VideoMedia[]>('reducerSetSubVideoStreams'),
    localVideoStreamAdded: actionCreator<MediaStream>('localVideoStreamAdded'),
    remoteVideoStreamAdded: actionCreator<RoomStream>('remoteVideoStreamAdded'),
    remoteVideoStreamRemoved: actionCreator<string>('remoteVideoStreamRemoved'),
    shareScreenButtonClicked: actionCreator<MediaStream>('shareScreenButtonClicked'),
    localShareScreenEnded: actionCreator<MediaStream>('localShareScreenEnded'),
};
