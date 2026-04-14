// Create an Axios instance with default configuration
import axios from "axios";

const api = axios.create({
  baseURL: "https://reunio.onrender.com",
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;