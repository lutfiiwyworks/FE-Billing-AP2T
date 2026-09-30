import api from "../../../shared/services/api";

export const getCekSelisihUnsurPtl = async (params) => {
  const response = await api.get("/api/cek-selisih-unsur-ptl", {
    params,
  });

  return response.data;
};
