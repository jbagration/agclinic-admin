import axios from 'axios';
import TokenStorage from "./TokenStorage";
import {apiUrl} from './environment'

let transport;


export const configureTransport = (token = null) => {

    const access = TokenStorage.getRefreshToken()

    const options =  token || TokenStorage.getAccessToken() ?
        {
            baseURL: apiUrl,
            headers: {
                Authorization: `Bearer ${token || TokenStorage.getAccessToken()}`,
            },
        }
        : { baseURL: apiUrl };
    transport = axios.create(options);
    return transport;
};

export const getTransport = () => transport || configureTransport();
