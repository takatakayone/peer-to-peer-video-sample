import {VideoMedia} from "../../models/videoMedia";

export interface VideoState {
    localVideoStream: VideoMedia | null;
    remoteVideoStreams: VideoMedia[];
    localShareScreenVideoStream: VideoMedia | null;
    preparationVideoStream: VideoMedia | null;
    mainVideoStream: VideoMedia | null;
    subVideoStreams: VideoMedia[];
}
