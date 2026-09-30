import api from "../../../shared/services/api";

export const getCekJamNyala = async (params) => {
  const response = await api.get("/api/cek-dibawah40jn", {
    params,
  });

  return response.data;
};
