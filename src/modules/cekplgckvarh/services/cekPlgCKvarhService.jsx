import api from "../../../shared/services/api";

export const getPlgCKvarh = async (params) => {
  const response = await api.get("/api/cek-plgc-kvarh", {
    params,
  });

  return response.data;
};
