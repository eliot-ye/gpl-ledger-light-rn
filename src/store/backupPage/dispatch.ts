import {createDispatch} from '@/libs/ReactContextStore';
import initialState from './initialState';

const initialStateStr = JSON.stringify(initialState);

interface DispatchPayload {
  reset: undefined;
  updateCount: number;
}

export default createDispatch<typeof initialState, DispatchPayload>({
  reset: () => JSON.parse(initialStateStr),
  updateCount: (state, payload) =>
    state.updateCount === payload ? state : {...state, updateCount: payload},
});
