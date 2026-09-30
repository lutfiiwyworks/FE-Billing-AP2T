import api from "../../../shared/services/api";

export const MATERAI_RULE_OPTIONS = [
  {
    value: "MATERAI_LAMA",
    label: "Materai Lama",
    description: "RPMAT 3.000 atau 6.000",
  },
  {
    value: "MATERAI_5JT",
    label: "Materai di Atas 5 Juta",
    description: "RPTAG > 5.000.000 dan RPMAT bukan 10.000",
  },
  {
    value: "MATERAI_DIBAWAH_5JT",
    label: "Materai di Bawah 5 Juta",
    description: "RPTAG <= 5.000.000 dan RPMAT lebih dari 0",
  },
];

export const getCekMaterai = async (params) => {
  const response = await api.get("/api/cek-materai", {
    params,
  });

  return response.data;
};
