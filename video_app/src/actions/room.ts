import actionCreatorFactory from 'typescript-fsa';
import {JoinRoomInfo, PeerAuthenticationInfo} from "../types/peer/types";

const actionCreator = actionCreatorFactory('Room');

export const RoomActions = {
    getRoomUrl: actionCreator<PeerAuthenticationInfo>('getRoomUrl'),
    setRoomUrl: actionCreator<string>('setRoomUrl'),
    joinRoom: actionCreator<JoinRoomInfo>('joinRoom'),
};
