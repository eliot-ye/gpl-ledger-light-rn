import {createDispatch} from '@/libs/CreateStore';
import initialState from './initialState';

const initialStateStr = JSON.stringify(initialState);

interface DispatchPayload {
  reset: undefined;
  userId: string;
  dbKey: string;
}

export default createDispatch<typeof initialState, DispatchPayload>({
  reset: () => JSON.parse(initialStateStr),
  userId: (state, payload) =>
    state.userId === payload ? state : {...state, userId: payload},
  dbKey: (state, payload) =>
    state.dbKey === payload ? state : {...state, dbKey: payload},
});
