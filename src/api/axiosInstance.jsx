import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://childsafetybackend.onrender.com/api",
  baseURL: "http://localhost:3000/api",
});

export default axiosInstance;
