import {api} from "./baseAPI";
import {loginRequest, loginResponse} from './types';

export const isAuthenticated = async () => {
    return !!(await verifyToken() && validateToken());
}

export const setAuthToken = (token: string) => {
    console.log("Setting token: " + token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem('token', token);
}

export const getMallID = async () => {
    try {
        const res = await api.post('/token/getMallID', {token: localStorage.getItem("token")});
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get mall ID. Please try again.');
    }
}

export const login = async (loginRequest: loginRequest) => {
    try {
        const res = await api.post<loginResponse>('/login/admin', loginRequest);
        console.log(res.data);
        setAuthToken(res.data.token);
        return res.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to login. Please try again.');
    }
};

export const logout = () => {
    api.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem('token');
    localStorage.clear();

    return {success: true};
};

export const validateToken = () => {
    const token = localStorage.getItem('token');
    return (token && token !== "");
}

export const verifyToken = async () => {
    return await api.post('/token/verify', {token: localStorage.getItem("token")}).then((res) => {
        return res.data.success;
    })
}

export const authenticate = async (navigate: any) => {
    if (!await isAuthenticated()) {
        navigate('/', {replace: true})
    }
}

export const authenticateLogin = async (navigate: any) => {
    if (await isAuthenticated()) {
        navigate('/dashboard', {replace: true})
    }
}