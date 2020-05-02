import { put, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga'

import {RoomActions} from "actions/room";
import {AuthenticatePeerApi} from "../apiClient/authenticatePeer";
import Peer, {PeerCredential} from "skyway-js";


function* getRoomUrl(action: ReturnType<typeof RoomActions.getRoomUrl>) {

    // authenticate Peer
    const response = yield AuthenticatePeerApi.post({peerId: action.payload.peerId, sessionToken: action.payload.sessionToken });
    const credential: PeerCredential = response.data;
    const peerId = response.data.peerId;

    if (!response.isSuccess) {
        // TODO: Errorのhandlingをちゃんとする
        alert(response.error);
        return;
    }

    // creating Peer connection
    // TODO: Maybe 共通的に呼べるようにしても良いかも
    const peer = new Peer(peerId, {
        key: "api_key",
        credential: credential,
        debug: 3
    });


    peer.once("open", () => {
        // FIXME: roomName=peerIDにしてるけど検討の余地あり
        // Roomをmeshにしている・・ブラウザの対応上sfuは厳しいか。
        const room = peer.joinRoom(`${peerId}`, {
            mode: "mesh"
        });


        const result = put(RoomActions.setRoomUrl(`http://localhost:3333/room/${room.name}`));
    });

    peer.once("error", () => {
        // peerでerror時の対応
    });
}

export function* RoomSaga() {
    yield takeLatest(RoomActions.getRoomUrl, getRoomUrl);
}
