import {RoomStream} from "skyway-js";
import {VideoMedia} from "../../models/videoMedia";

export interface VideoState {
    localVideoStream: VideoMedia | null;
    preparationVideoStream: VideoMedia | null;
    remoteVideoStreams: VideoMedia[];
    mainVideoStream: VideoMedia | null;
    subVideoStreams: VideoMedia[];
}
