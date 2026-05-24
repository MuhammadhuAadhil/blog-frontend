const DEFAULT_PRODUCTION_API_URL = "https://blog-backend-2-hddd.onrender.com";

function getApiBaseUrl() {
  const configuredUrl = process.env.REACT_APP_API_BASE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }

  return DEFAULT_PRODUCTION_API_URL;
}

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
