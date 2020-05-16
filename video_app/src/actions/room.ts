import actionCreatorFactory from 'typescript-fsa';
import {JoinRoomInfo, MakePeerConnectionInfo, PeerAuthenticationInfo} from "../types/peer/types";
import Peer, {MeshRoom, SfuRoom} from "skyway-js";

const actionCreator = actionCreatorFactory('Room');

export const RoomActions = {
    reducerSetRoomUrl: actionCreator<string>('reducerSetRoomUrl'),
    reducerSetPeer: actionCreator<Peer>('setPeer'),
    reducerSetRoom: actionCreator<MeshRoom | SfuRoom>('reducerSetRoom'),
    reducerIsInTheRoom: actionCreator<boolean>('reducerIsInTheRoom'),
    createRoom: actionCreator<PeerAuthenticationInfo>('createRoom'),
    joinRoomButtonClicked: actionCreator<JoinRoomInfo>('joinRoomButtonClicked'),
    joinedTheRoom: actionCreator<MeshRoom | SfuRoom>('joinedTheRoom'),
};
