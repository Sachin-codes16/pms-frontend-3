import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

const api = axios.create({
  baseURL: "https://essdemo.alwijha.net",
});

const DEV_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNiwicm9sZSI6Ik1hbmFnZXIiLCJkZXBhcnRtZW50IjoiTWFya2V0aW5nIiwiZXhwIjoxNzgxNzcwMDM5LCJpYXQiOjE3ODExNjUyMzksInRva2VuIjpudWxsfQ.64iXC2KRm0svNqe8bu8Dzq4zpQXCy05tsp-kRd2XhMc";
const authSessionKey = "_LAHOMES_AUTH_KEY_";

const getTokenFromLocalStorage = () => {
  if (typeof localStorage === "undefined") return undefined;

  const tokenKeys = ["token", "accessToken", "access_token", "authToken"];
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);
    if (token) return token.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");
  }

  const authSession = localStorage.getItem(authSessionKey);
  if (!authSession) return undefined;

  try {
    const parsedSession = JSON.parse(authSession);
    return (
      parsedSession?.token ||
      parsedSession?.accessToken ||
      parsedSession?.access_token
    );
  } catch {
    return undefined;
  }
};

const getTokenFromCookie = () => {
  try {
    const cookieValue = getCookie(authSessionKey);
    if (!cookieValue) return undefined;

    const parsedSession =
      typeof cookieValue === "string" ? JSON.parse(cookieValue) : cookieValue;
    return (
      parsedSession?.token ||
      parsedSession?.accessToken ||
      parsedSession?.access_token
    );
  } catch {
    return undefined;
  }
};

const getStoredToken = () => {
  const localToken = getTokenFromLocalStorage();
  if (localToken) return localToken;

  const cookieToken = getTokenFromCookie();
  if (cookieToken)
    return cookieToken.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");

  return DEV_AUTH_TOKEN;
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    if (
      status === 401 ||
      (typeof data === "string" &&
        data.toLowerCase().includes("token has expired"))
    ) {
      deleteCookie(authSessionKey);
      if (typeof window !== "undefined") {
        window.location.href = "/auth/sign-in";
      }
    }

    return Promise.reject(error);
  },
);
export default api;
