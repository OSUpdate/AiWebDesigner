import * as types from "./ActionTypes";

export const change = (index, value) => ({
    type: types.CHANGE,
    index,
    value
});

export const keyUp = (index, value) => ({
    type: types.KEYUP,
    index,
    value
});

export const signUp = () => ({
    type: types.SIGNUP
});