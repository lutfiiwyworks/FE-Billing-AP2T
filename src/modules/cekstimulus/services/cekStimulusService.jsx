import api from "../../../shared/services/api";

export const getCekStimulus = async (params) => {
  const response = await api.get("/api/cek-stimulus", {
    params,
  });

  return response.data;
};
