import { Select } from "antd";

import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";

import {
  getLpKurangDari,
  getLpLebihDari,
} from "../services/cekPlgLpService";

export default function CekLpPage({ feature }) {
  const fetchLp = async (params) => {
    const payload = {
    thblrek: params.thblrek,
    idpel: params.idpel,
    unitupi: params.unitupi,
    };

    if (params.jenisLp === "kurang") {
    return getLpKurangDari(payload);
    }

    return getLpLebihDari(payload);
  };

  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={fetchLp}
      errorMessage="Gagal mengambil data LP"
      initialValues={{
        jenisLp: "kurang",
      }}
      extraFilters={[
        {
          name: "jenisLp",
          label: "Filter TRFLWBP",
          rules: [
            {
              required: true,
              message: "Pilih jenis LP",
            },
          ],
          component: (
            <Select
              options={[
                {
                  label: "TRFLWBP < 1644.52",
                  value: "kurang",
                },
                {
                  label: "TRFLWBP >= 1644.52",
                  value: "lebih",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
