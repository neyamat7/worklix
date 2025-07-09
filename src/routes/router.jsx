import { createBrowserRouter } from "react-router";

import LoginPage from "../components/auth/LoginPage";

import RegisterPage from "../components/auth/RegisterPage";
import DashboardLayouts from "../layouts/DashboardLayouts";
import RootLayout from "../layouts/RootLayout";
import AddNewTask from "../pages/Dashboard/DashboardHome/BuyerDashboard/AddNewTask";
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
    element: (
      <PrivateRoutes>
        <DashboardLayouts />
        {/* <Dashboard /> */}
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoutes>
            <DashboardHome />
          </PrivateRoutes>
        ),
      },
      {
        path: "add-new-task",
        element: <AddNewTask />,
      },
    ],
  },
]);

export default router;
