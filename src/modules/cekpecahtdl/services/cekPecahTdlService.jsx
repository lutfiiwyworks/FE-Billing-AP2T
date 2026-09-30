import api from "../../../shared/services/api";

export const getPecahTdl = async (params) => {
  const response = await api.get("/api/cek-pecah-tdl", {
    params,
  });

  return response.data;
};
