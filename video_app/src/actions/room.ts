import actionCreatorFactory from 'typescript-fsa';
import {PeerAuthenticationInfo} from "../types/peer/types";

const actionCreator = actionCreatorFactory('Room');

export const RoomActions = {
    getRoomUrl: actionCreator<PeerAuthenticationInfo>('getRoomUrl'),
    setRoomUrl: actionCreator<string>('setRoomUrl'),
    // setVolumes: actionCreator<VolumeList>('setVolumes'),
    // setIsSearching: actionCreator<boolean>('setIsSearching'),
};
