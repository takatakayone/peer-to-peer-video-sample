import Peer, {MeshRoom, SfuRoom} from "skyway-js";

export interface PeerAuthenticationInfo {
    peerId: string
    sessionToken: string
}

export interface RoomState {
    roomUrl: string;
    currentPeer: Peer | null;
    isInTheRoom: boolean;
    currentRoom: MeshRoom | SfuRoom | null;
}

export interface JoinRoomInfo {
    roomName: string
    sessionToken: string
}

export interface MakePeerConnectionInfo {
    sessionToken: string;
}
