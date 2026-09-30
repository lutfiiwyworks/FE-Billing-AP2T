import api from "../../../shared/services/api";

export const getAnomaliStan = async (params) => {
  const response = await api.get("/api/cek-anomali-stan", {
    params,
  });

  return response.data;
};
