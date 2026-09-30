import api from "../../../shared/services/api";

export const getRpKoma = async (params) => {
  const response = await api.get("/api/cek-rp-koma", {
    params,
  });

  return response.data;
};
