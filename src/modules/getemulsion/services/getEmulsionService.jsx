import api from "../../../shared/services/api";

export const getEmulsion = async (params) => {
  const response = await api.get("/api/cek-emulsion", {
    params,
  });

  return response.data;
};
