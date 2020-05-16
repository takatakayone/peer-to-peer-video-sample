import {Dispatch} from "redux";
import Peer, {MeshRoom, RoomStream, SfuRoom} from "skyway-js";
import {VideoActions} from "../actions/video";
import {RoomActions} from "../actions/room";

let dispatch: Dispatch;

export const initializeDispatchForPeerAndRoomListeners = (dispatcher: Dispatch) => {
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
      const room: MeshRoom | SfuRoom= peer.joinRoom(roomName, {mode: "mesh", stream: localVideoStream});
      addRoomListeners(room);
  });

  peer.on("error", () => {

  });

  //TODO: このままだとメモリリークしてそうだから解除のタイミングとか考えて解除
};

const addRoomListeners = (room: MeshRoom | SfuRoom) => {

  room.on("data", ({src, data}) => {
     console.log("SEND受信");
     console.log(src);
     console.log(data);
  });

  room.once("open", () => {
      dispatch(RoomActions.joinedTheRoom(room));
  });

  room.on("stream", (stream: RoomStream) => {
      dispatch(VideoActions.remoteVideoStreamAdded(stream));
  });

  room.on("peerLeave", (peerId) => {
      dispatch(VideoActions.remoteVideoStreamRemoved(peerId));
  });



};
