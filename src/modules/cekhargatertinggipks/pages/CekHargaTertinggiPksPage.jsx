import { Select } from "antd";

import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import {
  CEK_HARGA_TERTINGGI_PKS_OPTIONS,
  getCekHargaTertinggiPks,
} from "../services/cekHargaTertinggiPksService";

const cekHargaTertinggiPksLabelMap = CEK_HARGA_TERTINGGI_PKS_OPTIONS.reduce((result, item) => {
  result[item.value] = item.label;
  return result;
}, {});

export default function CekHargaTertinggiPksPage({ feature }) {
  const title = feature?.label || "Cek Harga Tertinggi PKS";

  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={(params, values) => getCekHargaTertinggiPks(values.jenis, params)}
      errorMessage="Gagal mengambil data cek harga tertinggi PKS"
      initialValues={{
        jenis: "normal",
      }}
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
      })}
      extraFilters={[
        {
          name: "jenis",
          label: "Jenis Cek",
          rules: [{ required: true, message: "Jenis cek wajib dipilih" }],
          lg: 5,
          component: <Select options={CEK_HARGA_TERTINGGI_PKS_OPTIONS} />,
        },
      ]}
      fileName={({ values }) => `cek-harga-tertinggi-pks-${values.jenis || "normal"}`}
      fullscreenTitle={({ values }) =>
        `Data ${title} - ${cekHargaTertinggiPksLabelMap[values.jenis || "normal"] || "Semua TRFLWBP"}`
      }
      emptyDescription={({ values }) =>
        `Pilih ${cekHargaTertinggiPksLabelMap[values.jenis || "normal"] || "Semua TRFLWBP"} lalu klik cari`
      }
    />
  );
}
