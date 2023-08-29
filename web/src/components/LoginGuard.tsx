import React, { useEffect, useState } from 'react';
import { Route, Navigate, RouteProps, useNavigate, useLocation } from 'react-router-dom';
import { authenticate, isAuthenticated } from "../api/auth";

export const LoginGuard = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const checkAuthentication = async () => {
            const authenticated = await isAuthenticated();
            setIsAuth(authenticated);
        };

        checkAuthentication();
    }, []);

    return (
        <>
            {!isAuth ? (
                children
            ) : (
                <Navigate to="/dashboard" />
            )}
        </>
    );
};
