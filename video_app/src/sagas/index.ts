import { all, fork } from 'redux-saga/effects';
import {RoomSaga} from "./room";

export const rootSaga = function* root() {
    yield all([fork(RoomSaga)]);
};
