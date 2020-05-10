import { takeEvery, call, put, takeLatest, select } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga'

import {RoomActions} from "actions/room";
import {AuthenticatePeerApi} from "../apiClient/authenticatePeer";
import Peer, {MeshRoom, PeerCredential, RoomStream} from "skyway-js";

import {VideoActions} from "../actions/video";
import {addPeerForJoiningRoomListeners, addPeerForCreatingRoomListeners} from "../listeners/addPeerAndRoomListeners";
import {State} from "../reducers";
import {VideoMedia} from "../models/videoMedia";

const skyWayApiKey=`${process.env.REACT_APP_SKYWAY_API_KEY}`;

// Selectors
const selectorRemoteVideoStreams = (state: State) => state.video.remoteVideoStreams;
const selectorLocalVideoStream = (state: State) => state.video.localVideoStream;
const selectorCurrentPeer = (state: State) => state.room.currentPeer;
const selectorCurrentRoom = (state: State) => state.room.currentRoom;


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
    const localVideoMedia: VideoMedia = yield select(selectorLocalVideoStream);

    if (peer && localVideoMedia) {
        yield call(addPeerForJoiningRoomListeners, peer, roomName, localVideoMedia.mediaStream);
    }
}

function* watchLocalVideoStreamAdded(action: ReturnType<typeof VideoActions.localVideoStreamAdded>) {
    const localStream: MediaStream = action.payload;
    const localVideoStream = new VideoMedia(localStream, null);
    yield put(VideoActions.reducerSetLocalVideoStream(localVideoStream));
    yield put(VideoActions.reducerSetPreparationVideoStream(localVideoStream));
}

function* watchJoinedTheRoom(action: ReturnType<typeof RoomActions.joinedTheRoom>) {
    const room = action.payload;
    yield put(RoomActions.reducerSetRoom(room));
    yield put(RoomActions.reducerIsInTheRoom(true));
    yield call(setMainAndSubVideoStream);
}

function* watchRemoteVideoStreamAdded(action: ReturnType<typeof VideoActions.remoteVideoStreamAdded>) {
    const remoteStream: RoomStream = action.payload;
    const remoteVideoMedia: VideoMedia = new VideoMedia(remoteStream, remoteStream.peerId);
    yield put(VideoActions.reducerSetRemoteVideoStream(remoteVideoMedia));
    yield call(setMainAndSubVideoStream);
}

function* watchRemoteVideoStreamRemoved(action: ReturnType<typeof VideoActions.remoteVideoStreamRemoved>) {
    const removedPeerId: string = action.payload;
    const remoteVideoStreams: VideoMedia[] = yield select(selectorRemoteVideoStreams);
    const remainedVideoStreams: VideoMedia[] = remoteVideoStreams.filter(remoteStream => remoteStream.peerId !== removedPeerId);
    yield put(VideoActions.reducerSetRemoteVideoStreams(remainedVideoStreams));

    yield call(setMainAndSubVideoStream);
}

function* setMainAndSubVideoStream() {
    const localVideoStream: VideoMedia = yield select(selectorLocalVideoStream);
    const remoteVideoStreams: VideoMedia[] = yield select(selectorRemoteVideoStreams);

    // remoteVideoStreamsが存在しない場合はmain画面をlocalVideoStreamにする
    if (remoteVideoStreams.length === 0) {
        yield put(VideoActions.reducerSetMainVideoStream(localVideoStream));
        yield put(VideoActions.reducerSetSubVideoStreams([]));
    } else {
        // remoteVideoStreamで最初のやつをmain画面にset
        // localVideoStreamはsubViewの最初にset
        const mainRemoteVideoStream = remoteVideoStreams[0];
        yield put(VideoActions.reducerSetMainVideoStream(mainRemoteVideoStream));
        const subVideoStreams: VideoMedia[] = [];
        subVideoStreams.push(localVideoStream);
        remoteVideoStreams.forEach((remoteVideoStream: VideoMedia, index: number) => {
            if (index !== 0) {
                subVideoStreams.push(remoteVideoStream)
            }
        });
        yield put(VideoActions.reducerSetSubVideoStreams(subVideoStreams));
    }
}

function createPeer(peerId: string, peerCredential: PeerCredential): Peer {
    const peer: Peer = new Peer(peerId,{
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
