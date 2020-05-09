export class VideoMedia {
    constructor(public mediaStream: MediaStream, public peerId: string | null) {

    }

    get videoType(): VideoType{
        if (this.peerId) {
            return VideoType.RemoteVideo
        } else {
            return VideoType.LocalVideo
        }
    }
}


export enum VideoType {
    LocalVideo,
    RemoteVideo
}
