import api from "../../../shared/services/api";

const cekPpjEndpointMap = {
  normal: "/api/cek-ppj",
  bedaProsen: "/api/cek-ppj/beda-prosen",
};

export const CEK_PPJ_OPTIONS = [
  { label: "Cek PPJ", value: "normal" },
  { label: "Beda Prosen PPJ", value: "bedaProsen" },
];

export const getCekPpj = async (jenis, params) => {
  const endpoint = cekPpjEndpointMap[jenis] || cekPpjEndpointMap.normal;

  const response = await api.get(endpoint, {
    params,
  });

  return response.data;
};
