import api from "../../../shared/services/api";

export const getVwBilling720Jn = async (params) => {
  const response = await api.get("/api/vwbilling-720jn", {
    params,
  });

  return response.data;
};
