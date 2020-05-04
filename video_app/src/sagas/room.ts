import { take, call, put, takeLatest, select } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga'

import {RoomActions} from "actions/room";
import {AuthenticatePeerApi} from "../apiClient/authenticatePeer";
import Peer, {MeshRoom, PeerCredential, RoomStream} from "skyway-js";

import { State } from "../reducers";
import {VideoActions} from "../actions/video";

// SELECT CURRENT STORE STATE
const selectLocalVideoStream = (state: State) => state.video.localVideoStream;
const selectCurrentRoomName = (state: State) => state.room.currentRoomName;



const skyWayApiKey=`${process.env.REACT_APP_SKYWAY_API_KEY}`;

function* getRoomUrl(action: ReturnType<typeof RoomActions.getRoomUrl>) {
    // authenticate Peer
    const response = yield AuthenticatePeerApi.post({peerId: action.payload.peerId, sessionToken: action.payload.sessionToken });
    if (!response.isSuccess) {
        // TODO: Errorのhandlingをちゃんとする
        alert(response.error);
        return;
    }
    const credential: PeerCredential = response.data;
    const peerId = response.data.peerId;

    // creating Peer connection
    const peerChannel = yield call(setPeerChannel, peerId, credential);
    try {
        while (true) {
            const roomName = yield take(peerChannel);
            yield put(RoomActions.setRoomUrl(`${roomName}`));
        }
    } catch (error) {
        // yield put(someActionHandler.failure(error));
    }
}

function* joinRoom(action:  ReturnType<typeof RoomActions.joinRoom>) {
    // setLocalMediaStream
    const localMediaStream = action.payload.localMediaStream;
    if (localMediaStream) {
      yield put(VideoActions.setLocalVideoStream(localMediaStream));
    }

    // setCurrentRoomName
    yield put(RoomActions.setCurrentRoomName(action.payload.roomName));

    // authenticate Peer
    // TODO: peerIDは適切に生成/sessionTokenはちゃんとしたの入れる
    const randomPeerId = `${Math.floor((Math.random() * 100000000) + 1)}`;
    const sessionToken = "SESSION_TOKEN";

    const response = yield AuthenticatePeerApi.post({peerId: randomPeerId, sessionToken: sessionToken });
    if (!response.isSuccess) {
        // TODO: Errorのhandlingをちゃんとする
        alert(response.error);
        return;
    }
    const credential: PeerCredential = response.data;
    const peerId = response.data.peerId;
    const peer = new Peer(peerId,{
        key: skyWayApiKey,
        debug: 2,
        credential: credential,
    });

    // createPeerChannel
    const peerChannel = yield call(subscribePeerEvent, peer);
    try {
        while(true) {
            const peerFromChannel = yield take(peerChannel);
            yield put(RoomActions.setPeer(peerFromChannel));
        }
    } catch (error) {
        console.log(error)
    }
}

function* observeRoomEvents(action:  ReturnType<typeof RoomActions.setPeer>) {
    const peer = action.payload;
    const roomName = yield select(selectCurrentRoomName);
    const localVideoStream = yield select(selectLocalVideoStream);

    const room: MeshRoom = peer.joinRoom(roomName, {mode: "mesh", stream: localVideoStream});

    const roomStreamChannel = yield call(subscribeRoomStreamEvent, room);
    const roomPeerJoin = yield call(subscribeRoomPeerJoinEvent, room);
    try {
        while (true) {
            const remoteStream = yield take(roomStreamChannel);
            yield put(VideoActions.setRemoteVideoStreams(remoteStream))

            const peerId = yield take(roomPeerJoin);
            console.log(peerId)
        }
    } catch (error) {
        console.log(error)
    }

}


function setPeerChannel(peerId: string, credential: PeerCredential) {
    return eventChannel((emit) => {
        const peer = new Peer(peerId,{
            key: skyWayApiKey,
            debug: 2,
            credential: credential,
        });

        peer.once('open', () => {
            // FIXME: roomName=peerIDとなってるので直す
            const room = peer.joinRoom(peerId, {
                mode: "mesh",
            });
            emit(room.name);
        });

        // This subscriber function must return an unsubscribe function
        return () => {
            // TODO: must return an unsubscribe function
            emit(END)
        };
    });
}

function subscribePeerEvent(peer: Peer) {
    return eventChannel((emit) => {
        peer.on("open", () => {
            emit(peer)
        });

        // TODO: handle Error event
        peer.on("error", () => {

        });

        // This subscriber function must return an unsubscribe function
        return () => {
            // TODO: must return an unsubscribe function
            emit(END)
        };
    });
}

function subscribeRoomStreamEvent(room: MeshRoom) {
    return eventChannel((emit) => {
        room.on("stream", async (stream: RoomStream) => {
            emit(stream);
        });


        // This subscriber function must return an unsubscribe function
        return () => {
            // TODO: must return an unsubscribe function
            emit(END)
        };
    });
}

function subscribeRoomPeerJoinEvent(room: MeshRoom) {
    return eventChannel((emit) => {
        room.on("peerJoin", peerId => {
            console.log(peerId)
            console.log("PEER JOIN")
            emit(peerId)
        });


        // This subscriber function must return an unsubscribe function
        return () => {
            // TODO: must return an unsubscribe function
            emit(END)
        };
    });
}

export function* RoomSaga() {
    yield takeLatest(RoomActions.getRoomUrl, getRoomUrl);
    yield takeLatest(RoomActions.joinRoom, joinRoom);
    yield takeLatest(RoomActions.setPeer, observeRoomEvents)
}
