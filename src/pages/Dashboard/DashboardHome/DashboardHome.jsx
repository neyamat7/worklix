import { useUserRole } from "../../../hooks/useUserRole";
import Unauthorized from "../../UnAuthorized/UnAuthorized";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) return <div>Loading...</div>;
  if (role === "admin") return <AdminDashboard />;
  if (role === "user") return <UserDashboard />;
  if (role === "rider") return <RiderDashboard />;

  return <Unauthorized />;
};

export default DashboardHome;
