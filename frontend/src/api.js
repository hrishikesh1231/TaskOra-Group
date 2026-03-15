// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:3002/api",
//   withCredentials: true, // important for session
// });

// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: `http://${window.location.hostname}:3002/api`,
  withCredentials: true,
});

export default API;