import api from "../../../shared/services/api";

export const getAnomaliKoreksi = async (params) => {
  const response = await api.get("/api/cek-anomali-koreksi-billing", {
    params,
  });

  return response.data;
};
