import api from "../../../shared/services/api";

export const getSaldoStimulus = async (params) => {
  const response = await api.get("/api/cek-saldo-stimulus", {
    params,
  });

  return response.data;
};
