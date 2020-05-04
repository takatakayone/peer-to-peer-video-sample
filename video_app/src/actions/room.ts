import actionCreatorFactory from 'typescript-fsa';
import {JoinRoomInfo, PeerAuthenticationInfo} from "../types/peer/types";
import Peer, {MeshRoom} from "skyway-js";

const actionCreator = actionCreatorFactory('Room');

export const RoomActions = {
    getRoomUrl: actionCreator<PeerAuthenticationInfo>('getRoomUrl'),
    setRoomUrl: actionCreator<string>('setRoomUrl'),
    joinRoom: actionCreator<JoinRoomInfo>('joinRoom'),
    setCurrentRoom: actionCreator<MeshRoom>('setCurrentRoom'),
    setCurrentRoomName: actionCreator<string>('setCurrentRoomName'),
    setPeer: actionCreator<Peer>('setPeer')
};
