import api from "../../../shared/services/api";

export const getPemkwh0 = async (params) => {
  const response = await api.get("/api/cek-pemkwh0", {
    params,
  });

  return response.data;
};
