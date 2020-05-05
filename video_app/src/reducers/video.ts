import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {VideoActions} from "../actions/video";
import {VideoState} from "../types/video/video";


const INITIAL_STATE: VideoState = {
    localVideoStream: null,
    remoteVideoStreams: [],
};

export const videoReducer = reducerWithInitialState(INITIAL_STATE)
    .case(VideoActions.reducerSetLocalVideoStream, (state, stream) => {
        state.localVideoStream = stream;
        return state
    })
    .case(VideoActions.reducerSetRemoteVideoStreams, (state, stream) => {
       state.remoteVideoStreams.push(stream);
       return state
    });
