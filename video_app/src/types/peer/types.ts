import Peer, {MeshRoom, RoomStream, SfuRoom} from "skyway-js";

export interface PeerAuthenticationInfo {
    peerId: string
    sessionToken: string
}

export interface RoomState {
    sessionToken: string
    roomUrl: string
    currentRoomName: string
    currentRoom: MeshRoom | null
    currentPeer: Peer | null
}

export interface JoinRoomInfo {
    roomName: string
    sessionToken: string
}

export interface MakePeerConnectionInfo {
    sessionToken: string;
}

const a = new SfuRoom()
