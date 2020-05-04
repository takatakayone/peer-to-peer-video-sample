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
    .case(RoomActions.setRoomUrl, (state, payload) => {
        state.roomUrl = payload;
        return state
    })
    .case(RoomActions.setCurrentRoom, (state, room) => {
        state.currentRoom = room;
        return state
    })
    .case(RoomActions.setCurrentRoomName, (state, roomName) => {
        state.currentRoomName = roomName;
        return state
    })
    .case(RoomActions.setPeer, (state, peer) => {
        state.currentPeer = peer;
        return state
    });
