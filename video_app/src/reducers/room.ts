import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {PeerAuthenticationInfoState } from "../types/peer/types";
import {RoomActions} from "../actions/room";
import {GoogleBooksActions} from "../actions/googleBooks";


const INITIAL_STATE: PeerAuthenticationInfoState = {
    peerId: "abc",
    sessionToken: "session_token",
    roomUrl: "http//localhost:3333",
};

export const roomReducer = reducerWithInitialState(INITIAL_STATE)
    .case(RoomActions.getRoomUrl, (state, payload) => {
       return state
    })
    // .case(RoomActions.setRoomUrl, (state, payload) => ({...state, payload}));
    .case(RoomActions.setRoomUrl, (state, payload) => {
        state.roomUrl = payload

      return state
    });


    // .case(RoomActions.getRoomUrl, (state, name) => ({...state, name }))
    // .case(RoomActions.setRoomUrl, (state, name) => ({...state, name }));

// .case(GoogleBooksActions.setVolumes, (state, payload) => {
//     return state.set('volumeList', payload);
// })
//     .case(GoogleBooksActions.setIsSearching, (state, payload) => {
//         return state.set('isSearching', payload);
//     });

// export class a extends Record<{
//     volumeList: VolumeList;
//     isSearching: boolean;
// }>({
//     volumeList: new VolumeList(),
//     isSearching: false,
// }) {}
//
// export const a = reducerWithInitialState(new a())
//     .case(GoogleBooksActions.setVolumes, (state, payload) => {
//         return state.set('volumeList', payload);
//     })
//     .case(GoogleBooksActions.setIsSearching, (state, payload) => {
//         return state.set('isSearching', payload);
//     });
