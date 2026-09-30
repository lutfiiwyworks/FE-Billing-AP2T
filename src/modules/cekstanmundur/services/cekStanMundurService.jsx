import api from "../../../shared/services/api";

export const getStanMundur = async (params) => {
  const response = await api.get("/api/cek-stanmundur", {
    params,
  });

  return response.data;
};
