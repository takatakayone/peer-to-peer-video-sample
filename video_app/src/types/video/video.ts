export interface VideoState {
    localVideoStream: MediaStream | null;
    remoteVideoStreams: MediaStream[];
    mainVideoStream: MediaStream | null;
    subVideoStreams: MediaStream[];
}
