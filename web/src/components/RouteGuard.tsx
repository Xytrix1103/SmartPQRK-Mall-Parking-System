import React, { useEffect, useState } from 'react';
import { Route, Navigate, RouteProps, useNavigate, useLocation } from 'react-router-dom';
import { authenticate, isAuthenticated } from "../api/auth";
import Login from "../pages/Login";

// export RouteGuard component to be used in App.tsx. If user is not authenticated, redirect to login page, otherwise render component as normal
export const RouteGuard = ({ children }: { children: React.ReactNode }) => {
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
            {isAuth ? (
                children
            ) : (
                <Navigate to="/" replace={true} />
            )}
        </>
    );
};
