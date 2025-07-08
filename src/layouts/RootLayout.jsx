import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar/Navbar";
import NavbarTest from "../components/shared/Navbar/NavbarTest";
import NavbarViolet from "../components/shared/Navbar/NavbarViolet";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* <NavbarViolet /> */}
      {/* <NavbarTest /> */}
      <div className="flex-1">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default RootLayout;
