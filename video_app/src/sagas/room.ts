import { takeEvery, call, put, takeLatest, select } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga'

import {RoomActions} from "actions/room";
import {AuthenticatePeerApi} from "../apiClient/authenticatePeer";
import Peer, {MeshRoom, PeerCredential, RoomStream} from "skyway-js";

import {VideoActions} from "../actions/video";
import {addPeerForJoiningRoomListeners, addPeerForCreatingRoomListeners} from "../listeners/addPeerAndRoomListeners";
import {State} from "../reducers";

const skyWayApiKey=`${process.env.REACT_APP_SKYWAY_API_KEY}`;

// Selectors
const selectorRemoteVideoStreams = (state: State) => state.video.remoteVideoStreams;
const selectorLocalVideoStream = (state: State) => state.video.localVideoStream;
const selectorCurrentPeer = (state: State) => state.room.currentPeer;


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

function* makePeerConnection(sessionToken: string) {
    // authenticate Peer
    const randomPeerId = `${Math.floor((Math.random() * 100000000) + 1)}`;
    const response = yield AuthenticatePeerApi.post({peerId: randomPeerId, sessionToken: sessionToken });
    if (!response.isSuccess) {
        // TODO: Errorのhandlingをちゃんとする
        alert(response.error);
        return;
    }
    //TODO :ちゃんとresponseタイプ定義しよう
    const credential: PeerCredential = response.data;
    const peer: Peer = createPeer(randomPeerId, credential);
    yield put(RoomActions.reducerSetPeer(peer));
}

function* watchJoinRoomButtonClicked(action: ReturnType<typeof RoomActions.joinRoomButtonClicked>) {
    const roomName = action.payload.roomName;
    const sessionToken = action.payload.sessionToken;

    yield call(makePeerConnection, sessionToken);
    const peer = yield select(selectorCurrentPeer);
    const localVideoStream = yield select(selectorLocalVideoStream);

    if (peer && localVideoStream) {
        yield call(addPeerForJoiningRoomListeners, peer, roomName, localVideoStream);
    }
}

function* watchLocalVideoStreamAdded(action: ReturnType<typeof VideoActions.localVideoStreamAdded>) {
    const localStream: MediaStream = action.payload;
    yield put(VideoActions.reducerSetLocalVideoStream(localStream));
    yield put(VideoActions.reducerSetPreparationVideoStream(localStream));
}

function* watchJoinedTheRoom(action: ReturnType<typeof RoomActions.joinedTheRoom>) {
    yield put(RoomActions.reducerIsInTheRoom(true));

    yield call(setMainAndSubVideoStream);
}

function* watchRemoteVideoStreamAdded(action: ReturnType<typeof VideoActions.remoteVideoStreamAdded>) {
    const remoteStream: RoomStream = action.payload;
    yield put(VideoActions.reducerSetRemoteVideoStream(remoteStream));

    yield call(setMainAndSubVideoStream);
}

function* watchRemoteVideoStreamRemoved(action: ReturnType<typeof VideoActions.remoteVideoStreamRemoved>) {
    const removedPeerId: string = action.payload;
    const remoteVideoStreams: RoomStream[] = yield select(selectorRemoteVideoStreams);
    const remainedVideoStreams: RoomStream[] = remoteVideoStreams.filter(remoteStream => remoteStream.peerId !== removedPeerId);
    yield put(VideoActions.reducerSetRemoteVideoStreams(remainedVideoStreams));

    yield call(setMainAndSubVideoStream);
}

function* setMainAndSubVideoStream() {
    const localVideoStream = yield select(selectorLocalVideoStream);
    const remoteVideoStreams = yield select(selectorRemoteVideoStreams);

    // remoteVideoStreamsが存在しない場合はmain画面をlocalVideoStreamにする
    if (remoteVideoStreams.length === 0) {
        yield put(VideoActions.reducerSetMainVideoStream(localVideoStream));
        yield put(VideoActions.reducerSetSubVideoStreams([]));
    } else {
        // remoteVideoStreamで最初のやつをmain画面にset
        // localVideoStreamはsubViewの最初にset
        const mainRemoteVideoStream = remoteVideoStreams[0];
        yield put(VideoActions.reducerSetMainVideoStream(mainRemoteVideoStream));
        const subVideoStreams: MediaStream[] = [];
        subVideoStreams.push(localVideoStream);
        remoteVideoStreams.forEach((remoteVideoStream: MediaStream, index: number) => {
            if (index !== 0) {
                subVideoStreams.push(remoteVideoStream)
            }
        });
        yield put(VideoActions.reducerSetSubVideoStreams(subVideoStreams));
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
    yield takeLatest(RoomActions.joinRoomButtonClicked, watchJoinRoomButtonClicked);
    yield takeLatest(RoomActions.joinedTheRoom, watchJoinedTheRoom);
    yield takeLatest(VideoActions.localVideoStreamAdded, watchLocalVideoStreamAdded);
    yield takeEvery(VideoActions.remoteVideoStreamAdded, watchRemoteVideoStreamAdded);
    yield takeEvery(VideoActions.remoteVideoStreamRemoved, watchRemoteVideoStreamRemoved);
}
