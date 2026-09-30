import api from "../../../shared/services/api";

export const getPlgBtsMut = async (params) => {
  const response = await api.get("/api/cek-plg-bts-mut", {
    params,
  });

  return response.data;
};
