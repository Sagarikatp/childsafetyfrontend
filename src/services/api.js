import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/gps"; // Your Node.js server URL

// Fetch the latest GPS location
export const getCurrentLocation = async () => {
  const response = await axios.get(API_BASE_URL);
  const latestLocation = response.data[response.data.length - 1]; // Get the latest data
  console.log(latestLocation);
  return latestLocation;
};

// Fetch the location history
export const getLocationHistory = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};
