import api from "../../../shared/services/api";

export const getAnomaliPemkwh = async (params) => {
  const response = await api.get("/api/cek-anomali-pemkwh", {
    params,
  });

  return response.data;
};
