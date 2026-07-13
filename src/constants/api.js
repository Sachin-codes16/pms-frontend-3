import { getCookie, setCookie, deleteCookie } from "cookies-next";

export const API_BASE_URL = "https://alw.checkour.work";
const authSessionKey = "_LAHOMES_AUTH_KEY_";

const readToken = () => {
  try {
    const cookieValue = getCookie(authSessionKey);
    if (cookieValue) {
      const parsed =
        typeof cookieValue === "string" ? JSON.parse(cookieValue) : cookieValue;
      return (
        parsed?.token || parsed?.accessToken || parsed?.access_token || null
      );
    }

    if (typeof localStorage !== "undefined") {
      const tokenKeys = ["token", "accessToken", "access_token", "authToken"];
      for (const key of tokenKeys) {
        const token = localStorage.getItem(key);
        if (token)
          return token.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");
      }
    }

    return null;
  } catch (e) {
    return null;
  }
};

export let AUTH_TOKEN = readToken();

export const setAuthToken = (token) => {
  if (!token || typeof token !== "string") return;

  try {
    AUTH_TOKEN = token;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("token", token);
    }
    setCookie(authSessionKey, JSON.stringify({ token }));
  } catch (e) {
    // ignore
  }
};

export const clearAuthToken = () => {
  try {
    AUTH_TOKEN = null;
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
    }
    deleteCookie(authSessionKey);
  } catch (e) {}
};
