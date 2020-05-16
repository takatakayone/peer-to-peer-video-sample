import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {END, eventChannel} from 'redux-saga'

import {RoomActions} from "actions/room";
import {AuthenticatePeerApi} from "../apiClient/authenticatePeer";
import Peer, {PeerCredential, RoomStream, SfuRoom} from "skyway-js";

import {VideoActions} from "../actions/video";
import {addPeerForCreatingRoomListeners, addPeerForJoiningRoomListeners} from "../listeners/addPeerAndRoomListeners";
import {State} from "../reducers";
import {VideoMedia, VideoType} from "../models/videoMedia";
import {addShareScreenMediaStreamListeners} from "../listeners/mediaStreamListeners";
import {MessageType} from "../types/room/room";

const skyWayApiKey=`${process.env.REACT_APP_SKYWAY_API_KEY}`;

// Selectors
const selectorRemoteVideoStreams = (state: State) => state.video.remoteVideoStreams;
const selectorLocalVideoStream = (state: State) => state.video.localVideoStream;
const selectorLocalShareScreenVideoStream = (state: State) => state.video.localShareScreenStream;
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
    const localVideoStream = new VideoMedia(localStream, null, VideoType.LocalVideo);
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
    const remoteVideoMedia: VideoMedia = new VideoMedia(remoteStream, remoteStream.peerId, VideoType.RemoteVideo);

    // shareをしている場合はそれを新しく入ってきたデバイスに通知する
    const room = yield select(selectorCurrentRoom);
    const localShareVideo = yield select(selectorLocalShareScreenVideoStream);
    if (localShareVideo) {
        room.send({"eventName": "shareScreen"})
    }

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

function* watchShareScreenButtonClicked(action: ReturnType<typeof VideoActions.shareScreenButtonClicked>) {
    const shareScreenMediaStream: MediaStream = action.payload;
    const peer: Peer = yield select(selectorCurrentPeer);

    const localShareScreenStream = new VideoMedia(shareScreenMediaStream, peer.id, VideoType.LocalVideo);
    yield put(VideoActions.reducerSetLocalShareScreenStream(localShareScreenStream));

    // roomのmediaStreamをShareScreenに変更
    const room: SfuRoom = yield select(selectorCurrentRoom);
    room.replaceStream(localShareScreenStream.mediaStream);

    // ここでremote
    room.send({"eventName": "shareScreen"});

    yield call(addShareScreenMediaStreamListeners, shareScreenMediaStream);
    yield call(setMainAndSubVideoStream);
}

function* watchLocalShareScreenEnded(action: ReturnType<typeof VideoActions.localShareScreenEnded>) {
    // localShareScreenをnullにする
    yield put(VideoActions.reducerRemoveLocalShareScreenStream("removeShareScreen"));

    const room: SfuRoom = yield select(selectorCurrentRoom);
    const localVideo: VideoMedia = yield select(selectorLocalVideoStream);
    room.replaceStream(localVideo.mediaStream);

    yield call(setMainAndSubVideoStream);
}

function* watchMessageReceived(action: ReturnType<typeof RoomActions.messageReceived>) {
    const message: MessageType = action.payload;
    switch (message.eventName) {
        case "shareScreen":
           yield call(remoteShareScreenStarted, message.peerId);
        default:
            return;
    }
}

function* remoteShareScreenStarted(peerId: string) {
    const remoteVideoStreams: VideoMedia[] = yield select(selectorRemoteVideoStreams);
    remoteVideoStreams.forEach(remoteVideoStream => {
        // 一旦全てreset
        remoteVideoStream.resetMainScreen();
        if (remoteVideoStream.peerId === peerId) {
            remoteVideoStream.setMainScreen()
        }
    });
    yield call(setMainAndSubVideoStream);
}

function* setMainAndSubVideoStream() {
    const localVideoStream: VideoMedia = yield select(selectorLocalVideoStream);
    const localShareScreenStream: VideoMedia = yield select(selectorLocalShareScreenVideoStream);
    const remoteVideoStreams: VideoMedia[] = yield select(selectorRemoteVideoStreams);

    // ①: remoteVideoStreamsが無く、localVideoStreamがlocalVideo/shareScreenVideoの時=> localVideoStreamをMainに
    // ②: remoteVideoStreamsがあり、localShareScreenが存在する時=> localVideoStreamをMainに, remoteVideoStreamsをSubに
    // ③: remoteVideoStreamsがあり、localVideoStreamがlocalVideoの時=> remoteVideoStreamの最初をMain/localVideoStreamをSubの最初に、そのほかをSubに
    // ④: screenShareをremoteが始めた場合＝＞一番最後にShareをした画面がMainに、それ以外をSubに
    if (remoteVideoStreams.length === 0) {
        // ケース①
        yield put(VideoActions.reducerSetMainVideoStream(localShareScreenStream ? localShareScreenStream : localVideoStream));
        yield put(VideoActions.reducerSetSubVideoStreams([]));
    } else {

        if (localShareScreenStream) {
          // ケース②
          yield put(VideoActions.reducerSetMainVideoStream(localShareScreenStream));
          yield put(VideoActions.reducerSetSubVideoStreams(remoteVideoStreams));

        } else {
            const remoteMainShareScreenStream = remoteVideoStreams.filter(remoteStream => remoteStream.isMainScreen)[0];
            if (remoteMainShareScreenStream) {
                // ケース④
                yield put(VideoActions.reducerSetMainVideoStream(remoteMainShareScreenStream));
                const subVideoStreams = remoteVideoStreams.filter(remoteStream => !remoteStream.isMainScreen);
                subVideoStreams.push(localVideoStream);
                yield put(VideoActions.reducerSetSubVideoStreams(subVideoStreams));
            } else {
                // ケース③
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
    yield takeLatest(RoomActions.messageReceived, watchMessageReceived);
    yield takeLatest(VideoActions.shareScreenButtonClicked, watchShareScreenButtonClicked);
    yield takeLatest(VideoActions.localShareScreenEnded, watchLocalShareScreenEnded);
    yield takeLatest(VideoActions.localVideoStreamAdded, watchLocalVideoStreamAdded);
    yield takeEvery(VideoActions.remoteVideoStreamAdded, watchRemoteVideoStreamAdded);
    yield takeEvery(VideoActions.remoteVideoStreamRemoved, watchRemoteVideoStreamRemoved);
}
