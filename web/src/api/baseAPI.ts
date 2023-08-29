import axios, { AxiosResponse, AxiosError } from 'axios';
import { Toast } from '@chakra-ui/react';

const baseURL = 'http://localhost:4000/api/';

export const api = axios.create({
    baseURL,
    withCredentials: false,
});

const handleRequest = <T>(reqPromise: Promise<AxiosResponse<T>>) =>
    reqPromise
        .then(data => data.data)
        .catch(err => {
            throw new Error(
                (
                    (err as AxiosError).response?.data as { message: string }
                )?.message
            );
        });


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
        if (axios.isAxiosError(err)) {
            Toast({
                title: 'Error',
                description: err.response?.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        return Promise.reject(err);
    }
);
