import axios from "axios";

const API = axios.create({
  baseURL: "https://living-butler.onrender.com/api",
});

export default API;
