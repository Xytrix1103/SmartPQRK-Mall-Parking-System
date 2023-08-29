import {Route, Routes, useNavigate} from "react-router-dom";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Lots from "./pages/Lots";
import Directory from "./pages/Directory";
import Admins from "./pages/Admins";
import Users from "./pages/Users";
import {RouteGuard} from "./components/RouteGuard";
import {LoginGuard} from "./components/LoginGuard";
import {ModalProvider} from "./components/Modals";
import { registerLicense } from '@syncfusion/ej2-base';
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import Reservations from "./pages/Reservations";

registerLicense(
    "Mgo+DSMBaFt+QHFqVkNrXVNbdV5dVGpAd0N3RGlcdlR1fUUmHVdTRHRcQllhS35VdkZnXnxdeHI=;Mgo+DSMBPh8sVXJ1S0d+X1RPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXpRdEVlWXxad3dTRWY=;ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5XdEdjX39ddHNWQWZa;MTgwNjk4NkAzMjMxMmUzMTJlMzMzNVExN2o0Q2krVTFwajh2OWV6YklTN3FjbTRlUHgvZWZDNFR2QlZpTGRsK1k9;MTgwNjk4N0AzMjMxMmUzMTJlMzMzNUJwV3BQeElCWHhaQkJBQVpTSTkwdmpuaXZ2amJoR3VIc3o1L2xDWnkyK0k9;NRAiBiAaIQQuGjN/V0d+XU9Hc1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TckdhWXlec3BSQmRZVw==;MTgwNjk4OUAzMjMxMmUzMTJlMzMzNWY3SHVYUWkvTHdqZmFrWEhHSGNpNElhRGk1Wkd4R1ZKd210ZXpMbVYrY3c9;MTgwNjk5MEAzMjMxMmUzMTJlMzMzNUtHQ0tuK1RQNmNiRUQzNXd1d1F3Njc1Y0djNVRzTUZPeFlvYkdsRmpmQWM9;Mgo+DSMBMAY9C3t2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5XdEdjX39ddHNQR2da;MTgwNjk5MkAzMjMxMmUzMTJlMzMzNU5VNkhjeG9saFNDY1lWaklXZzNBYzExRk1ycUNndElKSXVHMU43Sm1yN3c9;MTgwNjk5M0AzMjMxMmUzMTJlMzMzNVBlVmdiMHJFYmQ4Qk0veWJqTi9LVUpPZEpXOHpCcFhveUhEM3JxbXR1ZnM9;MTgwNjk5NEAzMjMxMmUzMTJlMzMzNWY3SHVYUWkvTHdqZmFrWEhHSGNpNElhRGk1Wkd4R1ZKd210ZXpMbVYrY3c9"
);

function App() {
    const navigate = useNavigate();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                refetchOnReconnect: false,
                retry: 1,
            },
        },
    });

    const theme = extendTheme({
        fonts: {
            heading: "DM Sans",
            body: "DM Sans",
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <ModalProvider>
                    <Routes>
                        <Route
                            path="/"
                            element={<LoginGuard><Login /></LoginGuard>}
                        />
                        <Route
                            path="/dashboard"
                            element={<RouteGuard><Dashboard /></RouteGuard>}
                        />
                        <Route
                            path="/directory"
                            element={<RouteGuard><Directory /></RouteGuard>}
                        />
                        <Route
                            path="/lots"
                            element={<RouteGuard><Lots /></RouteGuard>}
                        />
                        <Route
                            path="/users"
                            element={<RouteGuard><Users /></RouteGuard>}
                        />
                        <Route
                            path="/activity"
                            element={<RouteGuard><Activity /></RouteGuard>}
                        />
                        <Route
                            path="/reservations"
                            element={<RouteGuard><Reservations /></RouteGuard>}
                        />
                        <Route
                            path="/admins"
                            element={<RouteGuard><Admins /></RouteGuard>}
                        />
                        <Route
                            path="/settings"
                            element={<RouteGuard><Settings /></RouteGuard>}
                        />
                    </Routes>
                </ModalProvider>
            </ChakraProvider>
        </QueryClientProvider>
    );
}

export default App;