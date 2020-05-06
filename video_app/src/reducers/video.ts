import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {VideoActions} from "../actions/video";
import {VideoState} from "../types/video/video";


const INITIAL_STATE: VideoState = {
    localVideoStream: null,
    preparationVideoStream: null,
    remoteVideoStreams: [],
    mainVideoStream: null,
    subVideoStreams: [],
};

export const videoReducer = reducerWithInitialState(INITIAL_STATE)
    .case(VideoActions.reducerSetLocalVideoStream, (state, stream) => {
        state.localVideoStream = stream;
        return state
    })
    .case(VideoActions.reducerSetPreparationVideoStream, (state, stream) => {
        state.preparationVideoStream = stream;
        return state
    })
    .case(VideoActions.reducerSetRemoteVideoStream, (state, stream) => {
       state.remoteVideoStreams.push(stream);
       return state
    })
    .case(VideoActions.reducerSetMainVideoStream, (state, stream) => {
        state.mainVideoStream = stream;
        return state
    })
    .case(VideoActions.reducerSetSubVideoStream, (state, stream) => {
       state.subVideoStreams.push(stream);
       return state
    });
