import api from "../../../shared/services/api";

const cekPpnEndpointMap = {
  tarifR3: "/api/cek-rppn-r3",
  sewaKap: "/api/cek-ppn/sewakap",
  sewaTrafo: "/api/cek-ppn/sewatrafo",
  bpTrafo: "/api/cek-ppn/bptrafo",
  rppnLebih0: "/api/cek-rppn-lebih0",
};

export const getCekPpn = async (jenis, params) => {
  const endpoint = cekPpnEndpointMap[jenis] || cekPpnEndpointMap.tarifR3;

  const response = await api.get(endpoint, {
    params,
  });

  return response.data;
};
