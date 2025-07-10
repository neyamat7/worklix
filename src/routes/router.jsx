import { createBrowserRouter } from "react-router";

import LoginPage from "../components/auth/LoginPage";

import RegisterPage from "../components/auth/RegisterPage";
import DashboardLayouts from "../layouts/DashboardLayouts";
import RootLayout from "../layouts/RootLayout";
import AddNewTask from "../pages/Dashboard/DashboardHome/BuyerDashboard/AddNewTask";
import MyTask from "../pages/Dashboard/DashboardHome/BuyerDashboard/MyTask";
import PaymentRecords from "../pages/Dashboard/DashboardHome/BuyerDashboard/PaymentRecords";
import PurchaseCoins from "../pages/Dashboard/DashboardHome/BuyerDashboard/PurchaseCoins/PurchaseCoins";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import TaskDetails from "../pages/Dashboard/DashboardHome/WorkerDashboard/TaskDetails";
import TaskList from "../pages/Dashboard/DashboardHome/WorkerDashboard/TaskList";
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
      {
        path: "my-tasks",
        element: <MyTask />,
      },
      {
        path: "purchase-coins",
        element: <PurchaseCoins />,
      },
      {
        path: "payment-records",
        element: <PaymentRecords />,
      },
      {
        path: "task-list",
        element: <TaskList />,
      },
      {
        path: "task-details/:taskId",
        element: <TaskDetails />,
      },
    ],
  },
]);

export default router;
