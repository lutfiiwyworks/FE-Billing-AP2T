import api from "../../../shared/services/api";

export const getPbPks = async (params) => {
  const response = await api.get("/api/cek-pb-pks", {
    params,
  });

  return response.data;
};
