import axiosInstance from "../api/axiosInstance";

// Fetch the latest GPS location
export const getCurrentLocation = async () => {
  const response = await axiosInstance.get("/gps");
  const latestLocation = response.data[0]; // Get the latest data
  return latestLocation;
};

// Fetch the location history
export const getLocationHistory = async () => {
  const response = await axiosInstance.get("/gps");
  return response.data;
};
