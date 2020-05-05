import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<MediaStream>('reducerSetLocalVideoStream'),
    reducerSetRemoteVideoStream: actionCreator<MediaStream>('reducerSetRemoteVideoStream'),
    reducerSetMainVideoStream: actionCreator<MediaStream>('reducerSetMainVideoStream'),
    reducerSetSubVideoStream: actionCreator<MediaStream>('reducerSetSubVideoStream'),
    videoStreamAdded: actionCreator<MediaStream>('videoStreamAdded'),
    remoteVideoStreamAdded: actionCreator<MediaStream>('remoteVideoStreamAdded'),
    remoteVideoStreamRemoved: actionCreator<string>('remoteVideoStreamRemoved'),
};
