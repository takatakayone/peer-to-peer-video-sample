import {RoomStream} from "skyway-js";

export interface VideoState {
    localVideoStream: RoomStream | null;
    remoteVideoStreams: RoomStream[];
    mainVideoStream: MediaStream | null;
    subVideoStreams: MediaStream[];
}
