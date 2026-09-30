import api from "../../../shared/services/api";

export const getCekCurah = async (params) => {
  const response = await api.get("/api/cek-rptag-0", {
    params,
  });

  return response.data;
};
