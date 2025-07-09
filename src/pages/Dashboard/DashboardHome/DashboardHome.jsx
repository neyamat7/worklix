import { useUserRole } from "../../../hooks/useUserRole";
import Unauthorized from "../../UnAuthorized/UnAuthorized";
import BuyerDashboard from "./BuyerDashboard/BuyerDashboard";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) return <div>Loading...</div>;
  // if (role === "admin") return <AdminDashboard />;
  if (role === "buyer") return <BuyerDashboard />;
  // if (role === "rider") return <RiderDashboard />;

  return <Unauthorized />;
};

export default DashboardHome;
