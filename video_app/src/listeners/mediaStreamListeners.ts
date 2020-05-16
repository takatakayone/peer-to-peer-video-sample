import {Dispatch} from "redux";
import {VideoActions} from "../actions/video";
import {VideoMedia} from "../models/videoMedia";

let dispatch: Dispatch;

export const initializeDispatchForMediaStreamListeners = (dispatcher: Dispatch) => {
    dispatch = dispatcher;
};

export const addShareScreenMediaStreamListers = (stream: MediaStream) => {
    stream.getVideoTracks()[0].onended = () => {
        dispatch(VideoActions.localShareScreenEnded(stream))
    };
    //TODO: このままだとメモリリークしてそうだから解除のタイミングとか考えて解除
};
