import api from "../../../shared/services/api";

export const getCekBeban = async (params) => {
  const response = await api.get("/api/cek-rpbeban", {
    params,
  });

  return response.data;
};
