import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://childsafetybackend.onrender.com/api",
});

export default axiosInstance;
