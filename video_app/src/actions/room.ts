import actionCreatorFactory from 'typescript-fsa';
import {JoinRoomInfo, MakePeerConnectionInfo, PeerAuthenticationInfo} from "../types/peer/types";
import Peer, {MeshRoom} from "skyway-js";

const actionCreator = actionCreatorFactory('Room');

export const RoomActions = {
    createRoom: actionCreator<PeerAuthenticationInfo>('createRoom'),
    reducerSetRoomUrl: actionCreator<string>('reducerSetRoomUrl'),
    joinRoomButtonClicked: actionCreator<JoinRoomInfo>('joinRoomButtonClicked'),
    reducerSetPeer: actionCreator<Peer>('setPeer')
};
