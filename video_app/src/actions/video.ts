import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    reducerSetLocalVideoStream: actionCreator<MediaStream>('reducerSetLocalVideoStream'),
    reducerSetRemoteVideoStreams: actionCreator<MediaStream>('reducerSetRemoteVideoStreams')
};
