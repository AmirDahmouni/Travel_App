import { atom } from 'recoil';
import { UserData } from './types/User';
import { recoilPersist } from 'recoil-persist'
import { Destination } from './types/Destination';
import { Application } from './types/Applications';

const { persistAtom } = recoilPersist()

export const isAuthenticatedState = atom<boolean>({
  key: 'isAuthenticatedState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userDataState = atom<UserData>({
  key: 'userDataState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const destinationState = atom<Destination>({
  key: 'destinationState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const applicationsState = atom<Application[]>({
  key: 'applicationsState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export const filterState = atom<string>({
  key: "keywordsState",
  default: "",
  effects_UNSTABLE: [persistAtom],
})