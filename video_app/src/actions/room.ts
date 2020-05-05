import actionCreatorFactory from 'typescript-fsa';
import {JoinRoomInfo, PeerAuthenticationInfo} from "../types/peer/types";
import Peer, {MeshRoom} from "skyway-js";

const actionCreator = actionCreatorFactory('Room');

export const RoomActions = {
    createRoom: actionCreator<PeerAuthenticationInfo>('createRoom'),
    reducerSetRoomUrl: actionCreator<string>('reducerSetRoomUrl'),
    joinRoom: actionCreator<JoinRoomInfo>('joinRoom'),
    reducerSetPeer: actionCreator<Peer>('setPeer')
};
