

import axios from "axios";

const API = axios.create({
  baseURL: `http://${window.location.hostname}:3002/api`,
  withCredentials: true,
});

export default API;