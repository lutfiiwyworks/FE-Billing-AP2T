import api from "../../../shared/services/api";

export const getSaldoReduksi = async (params) => {
  const response = await api.get("/api/cek-saldo-pasca", {
    params,
  });

  return response.data;
};
