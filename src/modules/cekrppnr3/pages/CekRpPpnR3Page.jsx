import { Select } from "antd";

import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekPpn } from "../services/cekRpPpnR3Service";

const cekPpnOptions = [
  { label: "Tarif R3", value: "tarifR3" },
  { label: "Sewa Kapasitor", value: "sewaKap" },
  { label: "Sewa Trafo", value: "sewaTrafo" },
  { label: "BP Trafo", value: "bpTrafo" },
  { label: "RP PPN > 0", value: "rppnLebih0" },
];

const cekPpnLabelMap = cekPpnOptions.reduce((result, item) => {
  result[item.value] = item.label;
  return result;
}, {});

export default function CekRpPpnR3Page({ feature }) {
  const title = feature?.label || "Cek PPN";

  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={(params, values) => getCekPpn(values.jenis, params)}
      errorMessage="Gagal mengambil data cek PPN"
      initialValues={{
        jenis: "tarifR3",
      }}
      mapParams={(values) => {
        const params = {
          thblrek: values.thblrek?.format("YYYYMM"),
          unitupi: values.unitupi?.trim() || undefined,
          idpel: values.idpel?.trim() || undefined,
        };

        if (values.jenis === "tarifR3") {
          params.source = "all";
          delete params.unitupi;
        }

        return params;
      }}
      extraFilters={[
        {
          name: "jenis",
          label: "Jenis Cek",
          rules: [{ required: true, message: "Jenis cek wajib dipilih" }],
          lg: 5,
          component: <Select options={cekPpnOptions} />,
        },
      ]}
      fileName={({ values }) => `cek-ppn-${values.jenis || "tarifR3"}`}
      fullscreenTitle={({ values }) =>
        `Data ${title} - ${cekPpnLabelMap[values.jenis || "tarifR3"] || "Tarif R3"}`
      }
      emptyDescription={({ values }) =>
        `Pilih ${cekPpnLabelMap[values.jenis || "tarifR3"] || "Tarif R3"} lalu klik cari`
      }
    />
  );
}
