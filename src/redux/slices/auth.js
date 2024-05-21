import {createSlice} from '@reduxjs/toolkit';
import {configureTransport} from "../../API/transport";
import {post} from "../../API/request";

const initialState = {
    accessToken: '',
    refreshToken: '',
    tokenExpire: '',
    user: {},
    ava: '',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            configureTransport(action.payload.accessToken);
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setUser: (state, action) => {
            state.user = action.payload || {};
        },
        setAva: (state, action) => {
            state.ava = action.payload
        },
    },
});

export const fetchLogin = (dispatch, {data, onSuccess = () => {}, onFailed = () => {},}) => {

    post('login', data).then((response) => {
        dispatch(setTokens({
            accessToken: response.data.tokens.accessToken,
            refreshToken: response.data.tokens.refreshToken,
        }));
        dispatch(setUser(response.data.user))
        onSuccess(response.data);
    }).catch((error) => {
        onFailed(error);
    });
};

export const logout = (dispatch) => {
    dispatch(setTokens({
        accessToken: '',
        refreshToken: '',
        user: {},
        isAuth: false
    }));
};

export const {setTokens, setRememberMe, setLoginData, setUser, setAva} = authSlice.actions;

export default authSlice.reducer;
