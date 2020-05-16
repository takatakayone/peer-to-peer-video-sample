export class VideoMedia {
    mediaStream: MediaStream;
    peerId: string | null;
    videoType: VideoType;
    isMainScreen: boolean;

    constructor(mediaStream: MediaStream, peerId: string | null, videoType: VideoType){
        this.mediaStream = mediaStream;
        this.peerId = peerId;
        this.videoType = videoType;
        this.isMainScreen = false;
    }

    setMainScreen() {
        this.isMainScreen = true
    }

    resetMainScreen() {
        this.isMainScreen = false
    }
    // isSharing : boolean | null = null;
    // constructor(public mediaStream: MediaStream, public peerId: string | null, public videoType: VideoType) {}

    // audioInDevices: IObservableArray<MediaDeviceInfo>;
    // videoInDevices: IObservableArray<MediaDeviceInfo>;
    // audioDeviceId: string | null;
    // videoDeviceId: string | null;
    // isAudioTrackMuted: boolean;
    // isVideoTrackMuted: boolean;
    // videoType: VideoType;
    // private audioTrack: MediaStreamTrack | null;
    // private videoTrack: MediaStreamTrack | null;
    //
    // constructor() {
    //     // @ts-ignore: to type IObservableArray
    //     this.audioInDevices = [];
    //     // @ts-ignore: to type IObservableArray
    //     this.videoInDevices = [];
    //     this.audioDeviceId = null;
    //     this.videoDeviceId = null;
    //     this.isVideoTrackMuted = false;
    //     this.isAudioTrackMuted = false;
    //     this.videoType = null;
    //     this.audioTrack = null;
    //     this.videoTrack = null;
    // }

}


export enum VideoType {
    LocalVideo,
    RemoteVideo
}
