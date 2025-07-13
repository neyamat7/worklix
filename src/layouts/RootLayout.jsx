import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar/Navbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <div className="container mx-auto">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Worklix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
