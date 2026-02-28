import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3002/api",
  withCredentials: true, // important for session
});

export default API;