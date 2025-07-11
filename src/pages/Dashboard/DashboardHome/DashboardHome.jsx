import { useUserRole } from "../../../hooks/useUserRole";
import Unauthorized from "../../UnAuthorized/UnAuthorized";
import AdminHome from "./AdminDashboard/AdminHome";
import BuyerHome from "./BuyerDashboard/BuyerHome";
import WorkerHome from "./WorkerDashboard/WorkerHome";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) return <div>Loading...</div>;
  if (role === "admin") return <AdminHome />;
  if (role === "buyer") return <BuyerHome />;
  if (role === "worker") return <WorkerHome />;

  return <Unauthorized />;
};

export default DashboardHome;
