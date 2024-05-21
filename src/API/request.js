import { useDispatch } from 'react-redux';
import { getTransport, configureTransport } from './transport';
import { logout, setTokens } from "../redux/slices/auth";
import TokenStorage from "./TokenStorage";

const generateHook = (callback) => () => {
    const dispatch = useDispatch();

    return callback(async (e) => {
        if (e?.response?.status !== 401) throw e;
        try {
            const token = await TokenStorage.getRefreshToken();

            const res = await get('refresh', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            await configureTransport(res.data.tokens.accessToken);
            dispatch(setTokens({
                accessToken: res.data.tokens.accessToken,
                refreshToken: res.data.tokens.refreshToken,
            }));

            await TokenStorage.setAccessToken(res.data.tokens.accessToken);
            await TokenStorage.setRefreshToken(res.data.tokens.refreshToken);
            await TokenStorage.setTokenReceived(Date.now() / 1000);

            delete e.response.config?.headers?.Authorization;
            const buf = (await getTransport()(e.response.config))?.data;
            return buf;
        } catch (e) {
            TokenStorage.logOut();
            logout(dispatch);
            throw e;
        }
    });
};

export const usePost = generateHook((middleware) => (
    async (path, payload, config) => {
        try {
            const response = await getTransport()
                .post(`/api/${path}`, payload, config);
            return response.data;
        } catch (e) {
            return middleware(e);
        }
    }
));

export const useGet = generateHook((middleware) => (
    async (path, token, config) => {
        try {
            const response = await getTransport(token)
                .get(`/api/${path}`, config);
            return response.data;
        } catch (e) {
            return middleware(e);
        }
    }
));

export const usePut = generateHook((middleware) => (
    async (path, payload, config) => {
        try {
            const response = await getTransport()
                .put(`/api/${path}`, payload, config);
            return response.data;
        } catch (e) {
            return middleware(e);
        }
    }
));

export const useDelete = generateHook((middleware) => (
    async (path, payload, config) => {
        try {
            const response = await getTransport()
                .delete(`/api/${path}`, payload, config);
            return response.data;
        } catch (e) {
            return middleware(e);
        }
    }
));

export const usePatch = generateHook((middleware) => (
    async (path, payload, config) => {
        try {
            const response = await getTransport()
                .patch(`/api/${path}`, payload, config);
            return response.data;
        } catch (e) {
            return middleware(e);
        }
    }
));

export const get = (path, config) => getTransport()
    .get(`/api/${path}`, config)
    .then((response) => response.data)
    .catch((e) => { throw e; });

export const post = (path, payload, config) => getTransport()
    .post(`/api/${path}`, payload, config)
    .then((response) => response.data)
    .catch((e) => { throw e; });

export const put = (path, payload = {}) => getTransport()
    .put(`/api/${path}`, payload)
    .then((response) => response.data)
    .catch((e) => { throw e; });

export const deleteRequest = (path, payload = {}) => getTransport()
    .delete(`/api/${path}`, payload)
    .then((response) => response.data)
    .catch((e) => { throw e; });

export const patch = (path, payload = {}) => getTransport()
    .patch(`/api/${path}`, payload)
    .then((response) => response.data)
    .catch((e) => { throw e; });

export const httpDelete = (path, config) => getTransport()
    .delete(`/api/${path}`, config)
    .then((response) => response.data)
    .catch((e) => { throw e; });