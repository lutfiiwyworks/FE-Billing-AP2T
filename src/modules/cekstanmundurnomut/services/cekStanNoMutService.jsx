import api from "../../../shared/services/api";

export const getStanNoMut = async (params) => {
  const response = await api.get("/api/cek-stan-nomut", {
    params,
  });

  return response.data;
};
