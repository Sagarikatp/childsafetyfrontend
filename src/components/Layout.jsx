import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MapIcon, ClockIcon, HomeIcon } from "./Icons";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper function to determine if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">Location Tracker</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            Logout
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
          <div className="flex justify-around">
            <NavLink
              to="/"
              className={`flex flex-col items-center py-2 px-4 ${
                isActive("/") ? "text-blue-600" : "text-gray-600"
              }`}
              end
            >
              <HomeIcon
                className={`h-6 w-6 ${
                  isActive("/") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="text-xs mt-1">Home</span>
            </NavLink>

            <NavLink
              to="/current"
              className={`flex flex-col items-center py-2 px-4 ${
                isActive("/current") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <MapIcon
                className={`h-6 w-6 ${
                  isActive("/current") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="text-xs mt-1">Current</span>
            </NavLink>

            <NavLink
              to="/history"
              className={`flex flex-col items-center py-2 px-4 ${
                isActive("/history") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <ClockIcon
                className={`h-6 w-6 ${
                  isActive("/history") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="text-xs mt-1">History</span>
            </NavLink>
            <NavLink
              to="/geofence"
              className={`flex flex-col items-center py-2 px-4 ${
                isActive("/geofence") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <MapIcon
                className={`h-6 w-6 ${
                  isActive("/geofence") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="text-xs mt-1">Geofence View</span>
            </NavLink>
          </div>
        </nav>

        {/* Desktop sidebar navigation */}
        <nav className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg pt-16">
          <div className="flex flex-col p-4 space-y-4">
            <NavLink
              to="/"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              end
            >
              <HomeIcon
                className={`h-6 w-6 mr-3 ${
                  isActive("/") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="font-medium">Home</span>
            </NavLink>

            <NavLink
              to="/current"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/current")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MapIcon
                className={`h-6 w-6 mr-3 ${
                  isActive("/current") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="font-medium">Current Location</span>
            </NavLink>

            <NavLink
              to="/history"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/history")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ClockIcon
                className={`h-6 w-6 mr-3 ${
                  isActive("/history") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="font-medium">Location History</span>
            </NavLink>
            <NavLink
              to="/geofence"
              className={`flex items-center p-3 rounded-lg ${
                isActive("/geofence")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ClockIcon
                className={`h-6 w-6 mr-3 ${
                  isActive("/geofence") ? "text-blue-600" : "text-gray-600"
                }`}
              />
              <span className="font-medium">Geofence View</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </PrivateRoute>
  );
}
