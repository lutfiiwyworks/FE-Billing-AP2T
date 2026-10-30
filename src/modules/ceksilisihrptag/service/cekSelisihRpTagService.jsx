import api from "../../../shared/services/api";

export const getSelisihRptag = async (params) => {
  const response = await api.get("/api/cek-selisih-rptag", {
    params,
  });

  return response.data;
};
