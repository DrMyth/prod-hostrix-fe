import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      const username = getUsernameFromToken();
      // console.log("Username: ", username);
      if (username) {
        config.headers["X-Username"] = username;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      console.warn("Token expired or invalid. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

function getUsernameFromToken(): string | null {
  const token = localStorage.getItem("token");
  // console.log(token);
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadPart));
    // console.log("Decoded Payload:", decodedPayload);
    return decodedPayload.username;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export { axiosInstance };
