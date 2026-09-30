import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekSelisihUnsurPtl } from "../services/cekSelisihUnsurPtlService";

export default function CekSelisihUnsurPtlPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekSelisihUnsurPtl}
      errorMessage="Gagal mengambil data cek selisih unsur PTL"
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
        source: "all",
      })}
      currencyColumns={[
        "RPLWBP",
        "RPWBP",
        "RPBLOK3",
        "RPKVARH",
        "RPBEBAN",
        "RP_KOMPOR",
        "RPPTL",
        "RPDISKON",
        "RPREDUKSI",
        "RPTAG",
      ]}
      fileName="cek-selisih-unsur-ptl"
    />
  );
}
