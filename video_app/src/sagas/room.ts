import { take, call, put, takeLatest, select } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga'

import {RoomActions} from "actions/room";
import {AuthenticatePeerApi} from "../apiClient/authenticatePeer";
import Peer, {MeshRoom, PeerCredential, RoomStream} from "skyway-js";

import {VideoActions} from "../actions/video";
import {addPeerForJoiningRoomListeners, addPeerForCreatingRoomListeners} from "../listeners/addPeerAndRoomListeners";



const skyWayApiKey=`${process.env.REACT_APP_SKYWAY_API_KEY}`;

function* createRoom(action: ReturnType<typeof RoomActions.createRoom>) {

    // authenticate Peer
    // TODO: joinRoomとほぼ同じことするので共通化したいけど、generatorだとうまく返値が設定できずドギマギ。時間とってなおす
    const peerId = action.payload.peerId;
    const sessionToken = action.payload.sessionToken;
    const response = yield AuthenticatePeerApi.post({peerId: peerId, sessionToken: sessionToken });
    if (!response.isSuccess) {
        // TODO: Errorのhandlingをちゃんとする
        alert(response.error);
        return;
    }
    const credential: PeerCredential = response.data;
    const peer = createPeer(peerId, credential);


    // TODO: PEER ID = ROOM NAMEにしてる
    yield call(addPeerForCreatingRoomListeners, peer, peerId)
}

function* joinRoom(action:  ReturnType<typeof RoomActions.joinRoom>) {

    const localMediaStream = action.payload.localMediaStream;
    if (localMediaStream) {
        // setLocalMediaStream
      　yield put(VideoActions.reducerSetLocalVideoStream(localMediaStream));

      　// authenticate Peer
        const randomPeerId = `${Math.floor((Math.random() * 100000000) + 1)}`;
        const response = yield AuthenticatePeerApi.post({peerId: randomPeerId, sessionToken: action.payload.sessionToken });
        if (!response.isSuccess) {
            // TODO: Errorのhandlingをちゃんとする
            alert(response.error);
            return;
        }
        //TODO :ちゃんとresponseタイプ定義しよう
        const credential: PeerCredential = response.data;
        const peer = createPeer(randomPeerId, credential);

        yield call(addPeerForJoiningRoomListeners, peer, action.payload.roomName, localMediaStream)
    }

}

function createPeer(peerId: string, peerCredential: PeerCredential): Peer {
    const peer = new Peer(peerId,{
        key: skyWayApiKey,
        debug: 2,
        credential: peerCredential,
    });

    return peer
}





export function* RoomSaga() {
    yield takeLatest(RoomActions.createRoom, createRoom);
    yield takeLatest(RoomActions.joinRoom, joinRoom);
}
