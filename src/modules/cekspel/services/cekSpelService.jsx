import api from "../../../shared/services/api";

export const getCekSpel = async (params) => {
  const response = await api.get("/api/cek-spel/tanpa-rptl-53950", {
    params,
  });

  return response.data;
};
