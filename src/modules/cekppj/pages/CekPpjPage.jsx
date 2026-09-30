import { Select } from "antd";

import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { CEK_PPJ_OPTIONS, getCekPpj } from "../services/cekPpjService";

const cekPpjLabelMap = CEK_PPJ_OPTIONS.reduce((result, item) => {
  result[item.value] = item.label;
  return result;
}, {});

export default function CekPpjPage({ feature }) {
  const title = feature?.label || "Cek PPJ";

  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={(params, values) => getCekPpj(values.jenis, params)}
      errorMessage="Gagal mengambil data cek PPJ"
      initialValues={{
        jenis: "normal",
      }}
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
      })}
      extraFilters={[
        {
          name: "jenis",
          label: "Jenis Cek",
          rules: [{ required: true, message: "Jenis cek wajib dipilih" }],
          lg: 5,
          component: <Select options={CEK_PPJ_OPTIONS} />,
        },
      ]}
      fileName={({ values }) => `cek-ppj-${values.jenis || "normal"}`}
      fullscreenTitle={({ values }) =>
        `Data ${title} - ${cekPpjLabelMap[values.jenis || "normal"] || "Cek PPJ"}`
      }
      emptyDescription={({ values }) =>
        `Pilih ${cekPpjLabelMap[values.jenis || "normal"] || "Cek PPJ"} lalu klik cari`
      }
    />
  );
}
