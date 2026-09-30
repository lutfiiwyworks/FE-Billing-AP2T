import api from "../../../shared/services/api";

export const getAnomaliJamnyalaLwbp = async (params) => {
  const response = await api.get("/api/cek-anomali-jn-lwbp", {
    params,
  });

  return response.data;
};
