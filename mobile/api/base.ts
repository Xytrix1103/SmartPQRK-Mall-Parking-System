import axios, { AxiosError, AxiosResponse } from 'axios';
import {baseURL} from './config';
export const api = axios.create({
    baseURL,
    withCredentials: false,
});

const handleRequest = <T>(reqPromise: Promise<AxiosResponse<T>>) => {
    return reqPromise
        .then(data => data.data)
        .catch(err => {
            throw new Error(
                (err as AxiosError).response?.data as string ||
                (err as AxiosError).message ||
                'Something went wrong'
            );
        });
};

export const apiPost = <T>(route: string, data?: any) => {
    return handleRequest(api.post<T>(route, data));
};
export const apiPut = <T>(route: string, data?: any) => {
    return handleRequest(api.put<T>(route, data));
};
export const apiGet = <T>(route: string, params?: any, extra?: any) => {
    return handleRequest(api.get<T>(route, { params, ...extra }));
};
export const apiDelete = <T>(route: string) => {
    return handleRequest(api.delete<T>(route));
};

api.defaults.headers.common['Content-Type'] = 'application/json';

api.interceptors.response.use(
    res => res,
    err => {
        return Promise.reject(err);
    }
);

export const checkServerStatus = async () => {
    try {
        const res = await api.get('/');
        return res.status === 200;
    } catch (err) {
        return false;
    }
};