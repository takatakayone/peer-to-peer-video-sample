import { History } from 'history';
import { combineReducers } from 'redux';
import { RouterState, connectRouter } from 'connected-react-router';

import { GoogleBooksState, googleBooksReducer } from 'reducers/googleBooks';
import {PeerAuthenticationInfoState} from "../types/peer/types";
import {roomReducer} from "./room";
import {VideoState} from "../types/video/video";
import {videoReducer} from "./video";

export interface State {
    router: RouterState;
    googleBooks: GoogleBooksState;
    room: PeerAuthenticationInfoState;
    video: VideoState;
}

export const rootReducer = (history: History) =>
    combineReducers({
        router: connectRouter(history),
        googleBooks: googleBooksReducer,
        room: roomReducer,
        video: videoReducer,
    });
