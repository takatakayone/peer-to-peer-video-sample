import {RoomStream} from "skyway-js";

export interface VideoState {
    localVideoStream: MediaStream | null;
    remoteVideoStreams: RoomStream[];
    mainVideoStream: MediaStream | null;
    subVideoStreams: MediaStream[];
}
