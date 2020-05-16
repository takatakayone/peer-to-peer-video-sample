import {VideoMedia} from "../../models/videoMedia";

export interface VideoState {
    localVideoStream: VideoMedia | null;
    localShareScreenStream: VideoMedia | null;
    remoteVideoStreams: VideoMedia[];
    preparationVideoStream: VideoMedia | null;
    mainVideoStream: VideoMedia | null;
    subVideoStreams: VideoMedia[];
}
