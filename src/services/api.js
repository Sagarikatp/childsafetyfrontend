import axios from "axios";

const API_BASE_URL = "https://childsafetybackend.onrender.com/api/gps"; // Your Node.js server URL

// Fetch the latest GPS location
export const getCurrentLocation = async () => {
  const response = await axios.get(API_BASE_URL);
  const latestLocation = response.data[0]; // Get the latest data
  return latestLocation;
};

// Fetch the location history
export const getLocationHistory = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};
