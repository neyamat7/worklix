import { createBrowserRouter } from "react-router";

import LoginPage from "../components/auth/LoginPage";

import RegisterPage from "../components/auth/RegisterPage";
import DashboardLayouts from "../layouts/DashboardLayouts";
import RootLayout from "../layouts/RootLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import Home from "../pages/Home/Home/Home";
import PrivateRoutes from "./PrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div>something went wrong</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: <h1>dashboard</h1>,
    children: [
      {
        index: true,
        element: (
          <PrivateRoutes>
            <DashboardHome />
          </PrivateRoutes>
        ),
      },
    ],
  },
]);

export default router;
