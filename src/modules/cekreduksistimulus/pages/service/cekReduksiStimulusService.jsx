import api from "../../../../shared/services/api";

export const getReduksiStimulus = async (params) => {
  const response = await api.get("/api/cek-reduksi-stimulus", {
    params,
  });

  return response.data;
};
