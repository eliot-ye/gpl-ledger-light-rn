import {createDispatch} from '@/libs/CreateStore';
import initialState from './initialState';

const initialStateStr = JSON.stringify(initialState);

interface DispatchPayload {
  reset: undefined;
  count: number;
  count2: number;
}

export default createDispatch<typeof initialState, DispatchPayload>({
  reset: () => JSON.parse(initialStateStr),
  count: (state, payload) => ({...state, count: payload}),
  count2: (state, payload) => ({...state, count2: payload}),
});
