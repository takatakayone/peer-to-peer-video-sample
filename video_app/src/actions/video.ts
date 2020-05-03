import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('Video');

export const VideoActions = {
    setLocalVideoStream: actionCreator<MediaStream>('setLocalVideoStream'),
    setRemoteVideoStreams: actionCreator<MediaStream>('setRemoteVideoStreams')
};
