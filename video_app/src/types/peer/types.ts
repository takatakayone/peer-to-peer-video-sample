import Peer, {MeshRoom} from "skyway-js";

export interface PeerAuthenticationInfo {
    peerId: string
    sessionToken: string
}

export interface RoomState {
    peerId: string
    sessionToken: string
    roomUrl: string
    currentRoomName: string
    currentRoom: MeshRoom | null
    currentPeer: Peer | null
}

export interface JoinRoomInfo {
    localMediaStream: MediaStream | null
    roomName: string
}
