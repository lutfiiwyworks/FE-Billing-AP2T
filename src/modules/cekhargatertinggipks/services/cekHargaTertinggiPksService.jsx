import api from "../../../shared/services/api";

export const CEK_HARGA_TERTINGGI_PKS_OPTIONS = [
  { label: "Semua TRFLWBP", value: "normal" },
  { label: "TRFLWBP > 2000", value: "trflwbpLebih2000" },
];

const endpointMap = {
  normal: "/api/cek-pks-trflwbp-2000",
  trflwbpLebih2000: "/api/cek-pks-trflwbp-2000/trflwbp-lebih-2000",
};

export const getCekHargaTertinggiPks = async (jenis = "normal", params) => {
  const response = await api.get(endpointMap[jenis] || endpointMap.normal, {
    params,
  });

  return response.data;
};
