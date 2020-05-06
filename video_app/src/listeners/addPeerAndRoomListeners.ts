import {Dispatch} from "redux";
import Peer, {MeshRoom, RoomStream} from "skyway-js";
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
  room.once("open", () => {
      console.log("You are in the room!");
  });

  room.on("stream", (stream: RoomStream) => {
      dispatch(VideoActions.remoteVideoStreamAdded(stream));
  });

  room.on("peerLeave", (peerId) => {
      console.log("PEER LEAVE");
      dispatch(VideoActions.remoteVideoStreamRemoved(peerId));
  });
};
