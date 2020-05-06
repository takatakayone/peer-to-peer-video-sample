import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { RoomState } from "../types/peer/types";
import {RoomActions} from "../actions/room";


const INITIAL_STATE: RoomState = {
    roomUrl: "",
    currentPeer: null,
    isInTheRoom: false,
};

export const roomReducer = reducerWithInitialState(INITIAL_STATE)
    .case(RoomActions.reducerSetRoomUrl, (state, payload) => {
        state.roomUrl = payload;
        return state
    })
    .case(RoomActions.reducerSetPeer, (state, peer) => {
        state.currentPeer = peer;
        return state
    })
    .case(RoomActions.reducerIsInTheRoom, (state, payload) => {
        state.isInTheRoom = payload;
        return state
    });
