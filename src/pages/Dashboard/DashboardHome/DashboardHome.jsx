import { useUserRole } from "../../../hooks/useUserRole";
import Unauthorized from "../../UnAuthorized/UnAuthorized";
import BuyerHome from "./BuyerDashboard/BuyerHome";
import { WorkerDashboard } from "./WorkerDashboard/WorkerDashboard";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) return <div>Loading...</div>;
  // if (role === "admin") return <AdminDashboard />;
  if (role === "buyer") return <BuyerHome />;
  if (role === "worker") return <WorkerDashboard />;

  return <Unauthorized />;
};

export default DashboardHome;
