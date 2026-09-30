import api from "../../../shared/services/api";

export const getCekreduksiRp0 = async (params) => {
  const response = await api.get("/api/cek-reduksi-rp0", {
    params,
  });

  return response.data;
};
