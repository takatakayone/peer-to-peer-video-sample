import { History } from 'history';
import { combineReducers } from 'redux';
import { RouterState, connectRouter } from 'connected-react-router';

import {RoomState} from "../types/peer/types";
import {roomReducer} from "./room";
import {VideoState} from "../types/video/video";
import {videoReducer} from "./video";

export interface State {
    router: RouterState;
    room: RoomState;
    video: VideoState;
}

export const rootReducer = (history: History) =>
    combineReducers({
        router: connectRouter(history),
        room: roomReducer,
        video: videoReducer,
    });
