import {Dispatch} from "redux";
import {VideoActions} from "../actions/video";
import Peer from "skyway-js";

let dispatch: Dispatch;

export const initializeDispatchForMediaStreamListeners = (dispatcher: Dispatch) => {
    dispatch = dispatcher;
};

export const addShareScreenMediaStreamListeners = (stream: MediaStream) => {
    stream.getVideoTracks()[0].onended = () => {
        dispatch(VideoActions.localShareScreenEnded("shareScreenEnded"))
    };
    //TODO: このままだとメモリリークしてそうだから解除のタイミングとか考えて解除
};
