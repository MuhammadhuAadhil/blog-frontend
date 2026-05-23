const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || "https://blog-backend-2-hddd.onrender.com"
).replace(/\/+$/, "");

export default API_BASE_URL;
