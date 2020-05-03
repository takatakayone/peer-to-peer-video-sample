export interface PeerAuthenticationInfo {
    peerId: string
    sessionToken: string
}

export interface PeerAuthenticationInfoState {
    peerId: string
    sessionToken: string
    roomUrl: string
}

export interface ResponsePeerAuthenticateInfo {
    authToken: string
    peerId: string
    timeStamp: number
    ttl: number
}

export interface JoinRoomInfo {
    localMediaStream: MediaStream
    roomName: string
}
