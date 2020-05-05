import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { RoomState } from "../types/peer/types";
import {RoomActions} from "../actions/room";


const INITIAL_STATE: RoomState = {
    peerId: "abc",
    sessionToken: "session_token",
    roomUrl: "",
    currentRoomName: "",
    currentRoom: null,
    currentPeer: null,
};

export const roomReducer = reducerWithInitialState(INITIAL_STATE)
    .case(RoomActions.reducerSetRoomUrl, (state, payload) => {
        state.roomUrl = payload;
        return state
    })
    .case(RoomActions.reducerSetPeer, (state, peer) => {
        state.currentPeer = peer;
        return state
    });
