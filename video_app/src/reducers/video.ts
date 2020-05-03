import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {VideoActions} from "../actions/video";
import {VideoState} from "../types/video/video";


const INITIAL_STATE: VideoState = {
    localVideoStream: new MediaStream(),
    remoteVideoStreams: [],
};

export const videoReducer = reducerWithInitialState(INITIAL_STATE)
    .case(VideoActions.setLocalVideoStream, (state, stream) => {
        state.localVideoStream = stream;
        return state
    })
    .case(VideoActions.setRemoteVideoStreams, (state, stream) => {
       state.remoteVideoStreams.push(stream);
       return state
    });
