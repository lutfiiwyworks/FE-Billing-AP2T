import api from "../../../shared/services/api";

export const getPlgBts = async (params) => {
  const response = await api.get("/api/cek-plg-bts", {
    params,
  });

  return response.data;
};
