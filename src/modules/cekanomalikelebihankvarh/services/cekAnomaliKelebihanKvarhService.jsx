import api from "../../../shared/services/api";

export const getCekAnomaliKelebihanKvarh = async (params) => {
  const response = await api.get("/api/cek-anomali-kelebihan-kvarh", {
    params,
  });

  return response.data;
};
