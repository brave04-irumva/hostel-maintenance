import axios from "axios";

const api = axios.create({
  // If we are on localhost, use localhost:5000. 
  // If we are on the web, use the variable we set in Vercel.
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

export default api;