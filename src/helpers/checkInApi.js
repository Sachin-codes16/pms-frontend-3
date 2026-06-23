import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

const checkInApi = axios.create({
  baseURL: "https://alw.checkour.work",
});

const authSessionKey = "_LAHOMES_AUTH_KEY_";

const isUsableToken = (token) =>
  typeof token === "string" &&
  token.length > 0 &&
  !["undefined", "null"].includes(token.toLowerCase());

const getTokenFromLocalStorage = () => {
  if (typeof localStorage === "undefined") return undefined;

  const tokenKeys = ["token", "accessToken", "access_token", "authToken"];
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);
    if (isUsableToken(token))
      return token.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");
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
  if (isUsableToken(localToken)) return localToken;

  const cookieToken = getTokenFromCookie();
  if (isUsableToken(cookieToken))
    return cookieToken.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");

  return undefined;
};

checkInApi.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default checkInApi;
