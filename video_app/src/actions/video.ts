import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<MediaStream>('reducerSetLocalVideoStream'),
    reducerSetRemoteVideoStreams: actionCreator<MediaStream>('reducerSetRemoteVideoStreams'),
    reducerSetMainVideoStream: actionCreator<MediaStream>('reducerSetMainVideoStream'),
    reducerSetSubVideoStream: actionCreator<MediaStream>('reducerSetSubVideoStream'),
    videoStreamAdded: actionCreator<MediaStream>('videoStreamAdded'),
    remoteVideoStreamRemoved: actionCreator<string>('remoteVideoStreamRemoved'),
};
