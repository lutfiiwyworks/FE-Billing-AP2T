import api from "../../../shared/services/api";

export const loginUser = async (payload) => {
  const res = await api.post("/apis/users/login", payload);
  return res.data;
};
