import {Dispatch} from "redux";
import Peer, {MeshRoom} from "skyway-js";
import {VideoActions} from "../actions/video";
import {RoomActions} from "../actions/room";

let dispatch: Dispatch;

export const initializeDispatchAndState = (dispatcher: Dispatch) => {
    dispatch = dispatcher;
};

export const addPeerForCreatingRoomListeners = (peer: Peer, roomName: string) => {
    peer.on("open", () => {
        peer.joinRoom(roomName, {mode: "mesh"});
        dispatch(RoomActions.reducerSetRoomUrl(`${roomName}`))
    });

    peer.on("error", () => {

    });

    //TODO: このままだとメモリリークしてそうだから解除のタイミングとか考えて解除
};


export const addPeerForJoiningRoomListeners = (peer: Peer, roomName: string, localVideoStream: MediaStream) => {
  peer.on("open", () => {
      const room: MeshRoom = peer.joinRoom(roomName, {mode: "mesh", stream: localVideoStream});
      addRoomListeners(room);
  });

  peer.on("error", () => {

  });

  //TODO: このままだとメモリリークしてそうだから解除のタイミングとか考えて解除
};

const addRoomListeners = (room: MeshRoom) => {
  room.on("open", () => {

  });

  room.on("stream", (stream) => {
      dispatch(VideoActions.reducerSetRemoteVideoStreams(stream));
      dispatch(VideoActions.videoStreamAdded());
  });

  room.on("peerLeave", (peerId) => {
      console.log("PEER LEAVE");
      console.log(peerId)
  });
};
