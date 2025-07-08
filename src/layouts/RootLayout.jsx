import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar/Navbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default RootLayout;
