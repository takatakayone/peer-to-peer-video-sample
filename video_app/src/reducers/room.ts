import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {PeerAuthenticationInfoState } from "../types/peer/types";
import {RoomActions} from "../actions/room";


const INITIAL_STATE: PeerAuthenticationInfoState = {
    peerId: "abc",
    sessionToken: "session_token",
    roomUrl: "",
};

export const roomReducer = reducerWithInitialState(INITIAL_STATE)
    .case(RoomActions.setRoomUrl, (state, payload) => {
        state.roomUrl = payload;
        return state
    });
