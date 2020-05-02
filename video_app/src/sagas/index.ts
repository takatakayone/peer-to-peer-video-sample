import { all, fork } from 'redux-saga/effects';
import {GoogleBooksSaga} from "./googleBooks";
import {RoomSaga} from "./room";

export const rootSaga = function* root() {
    yield all([fork(GoogleBooksSaga), fork(RoomSaga)]);
};
