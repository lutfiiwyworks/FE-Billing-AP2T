import api from "../../../shared/services/api";

export const getLpKurangDari = async (params) => {
  const response = await api.get("/api/cek-lp-kurangdari", {
    params,
  });

  return response.data;
};

export const getLpLebihDari = async (params) => {
  const response = await api.get("/api/cek-lp-lebihdari", {
    params,
  });

  return response.data;
};
