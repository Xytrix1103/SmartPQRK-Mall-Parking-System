import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import React from "react";
import {LoadingScreen} from "./LoadingScreen";
export const QueryBoundaries = ({ children }: { children: React.ReactNode }) => (
    <QueryErrorResetBoundary>
        {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={ErrorView}>
                <React.Suspense fallback={<LoadingScreen />}>
                    {children}
                </React.Suspense>
            </ErrorBoundary>
        )}
    </QueryErrorResetBoundary>
);

const ErrorView = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <div>
            <div>{error.message}</div>
            <button title="Retry" onClick={resetErrorBoundary} />
        </div>
    );
};