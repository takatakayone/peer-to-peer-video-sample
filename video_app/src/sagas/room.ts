import { take, call, put, takeLatest, select, fork } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga'

import {RoomActions} from "actions/room";
import {AuthenticatePeerApi} from "../apiClient/authenticatePeer";
import Peer, {PeerCredential, RoomStream, SfuRoom} from "skyway-js";

import { State } from "../reducers";
import {VideoActions} from "../actions/video";

const selectLocalVideoStream = (state: State) => state.video.localVideoStream;
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
    yield put(VideoActions.setLocalVideoStream(action.payload.localMediaStream));

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
    const localVideoStream = yield select(selectLocalVideoStream);

    const peer = new Peer(peerId,{
        key: skyWayApiKey,
        debug: 2,
        credential: credential,
    });

    const roomChannel = yield call(setRoomChannel, peer, localVideoStream, action.payload.roomName);
    try {
        while (true) {
            const stream = yield take(roomChannel);
            yield put(VideoActions.setRemoteVideoStreams(stream));
        }
    } catch (error) {
        // yield put(someActionHandler.failure(error));
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

function setRoomChannel(peer: Peer, localVideoStream: MediaStream, roomName: string) {
    return eventChannel((emit) => {
        peer.on("open", () => {
            const room = peer.joinRoom(roomName, {
                mode: "mesh",
                stream: localVideoStream,
            });

            room.once('open', () => {
                console.log("ONCE OPEN EVENT")
            });
            room.on('peerJoin', peerId => {
                console.log("PEER JOIN EVENT")
                console.log(peerId)
            });

            room.on("stream", async (stream: RoomStream) => {
                console.log("STREAMMMMMMMMMMM")
                console.log(stream)
                emit(stream);
            })

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



export function* RoomSaga() {
    yield takeLatest(RoomActions.getRoomUrl, getRoomUrl);
    yield takeLatest(RoomActions.joinRoom, joinRoom);
}
