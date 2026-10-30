import api from "../../../shared/services/api";

export const getChekRpBK = async (params) => {
  const response = await api.get("/api/cek-rpbk", {
    params,
  });

  return response.data;
};
