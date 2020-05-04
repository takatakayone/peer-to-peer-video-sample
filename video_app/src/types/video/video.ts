export interface VideoState {
    localVideoStream: MediaStream | null;
    remoteVideoStreams: MediaStream[];
}
