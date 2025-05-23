"use client";

import { useNavigate } from "react-router-dom";
import { MapIcon, ClockIcon } from "../components/Icons";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] md:ml-64 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Location Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/current")}
            className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-6 transition-colors"
          >
            <MapIcon className="h-12 w-12 mb-3" />
            <span className="text-lg font-medium">Current Location</span>
          </button>

          <button
            onClick={() => navigate("/history")}
            className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg p-6 transition-colors"
          >
            <ClockIcon className="h-12 w-12 mb-3" />
            <span className="text-lg font-medium">Location History</span>
          </button>
          <button
            onClick={() => navigate("/geofence")}
            className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg p-6 transition-colors"
          >
            <ClockIcon className="h-12 w-12 mb-3" />
            <span className="text-lg font-medium">Geofence View</span>
          </button>
        </div>

        <p className="text-gray-600 text-center mt-8">
          Track and view your location data with our easy-to-use interface
        </p>
      </div>
    </div>
  );
}
