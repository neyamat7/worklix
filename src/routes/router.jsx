import { createBrowserRouter } from "react-router";

import LoginPage from "../components/auth/LoginPage";

import RegisterPage from "../components/auth/RegisterPage";
import DashboardLayouts from "../layouts/DashboardLayouts";
import RootLayout from "../layouts/RootLayout";
import ManageTasks from "../pages/Dashboard/DashboardHome/AdminDashboard/ManageTasks";
import ManageUsers from "../pages/Dashboard/DashboardHome/AdminDashboard/ManageUsers";
import AddNewTask from "../pages/Dashboard/DashboardHome/BuyerDashboard/AddNewTask";
import MyTask from "../pages/Dashboard/DashboardHome/BuyerDashboard/MyTask";
import PaymentRecords from "../pages/Dashboard/DashboardHome/BuyerDashboard/PaymentRecords";
import PurchaseCoins from "../pages/Dashboard/DashboardHome/BuyerDashboard/PurchaseCoins/PurchaseCoins";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import MySubmissions from "../pages/Dashboard/DashboardHome/WorkerDashboard/MySubmissions";
import TaskDetails from "../pages/Dashboard/DashboardHome/WorkerDashboard/TaskDetails";
import TaskList from "../pages/Dashboard/DashboardHome/WorkerDashboard/TaskList";
import Withdrawal from "../pages/Dashboard/DashboardHome/WorkerDashboard/Withdrawals";
import Home from "../pages/Home/Home/Home";
import Unauthorized from "../pages/UnAuthorized/UnAuthorized";
import AdminRoute from "./AdminRoute";
import BuyerRoute from "./BuyerRoute";
import PrivateRoutes from "./PrivateRoutes";
import WorkerRoute from "./WorkerRoute";

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
        element: (
          <BuyerRoute>
            <AddNewTask />
          </BuyerRoute>
        ),
      },
      {
        path: "my-tasks",
        element: (
          <BuyerRoute>
            <MyTask />
          </BuyerRoute>
        ),
      },
      {
        path: "purchase-coins",
        element: (
          <BuyerRoute>
            <PurchaseCoins />
          </BuyerRoute>
        ),
      },
      {
        path: "payment-records",
        element: (
          <BuyerRoute>
            <PaymentRecords />
          </BuyerRoute>
        ),
      },
      // worker routes
      {
        path: "task-list",
        element: (
          <WorkerRoute>
            <TaskList />
          </WorkerRoute>
        ),
      },
      {
        path: "task-details/:taskId",
        element: (
          <WorkerRoute>
            <TaskDetails />
          </WorkerRoute>
        ),
      },
      {
        path: "my-submissions",
        element: (
          <WorkerRoute>
            <MySubmissions />
          </WorkerRoute>
        ),
      },
      {
        path: "withdrawals",
        element: (
          <WorkerRoute>
            <Withdrawal />
          </WorkerRoute>
        ),
      },
      // admin routes
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-tasks",
        element: (
          <AdminRoute>
            <ManageTasks />
          </AdminRoute>
        ),
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
]);

export default router;
