import { clearAuth } from "../utils/authStorage";

export const logout = () => {
  clearAuth();
  window.location.href = "/";
};