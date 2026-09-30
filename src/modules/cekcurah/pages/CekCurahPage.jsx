import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekCurah } from "../services/cekCurahService";

export default function CekCurahPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekCurah}
      errorMessage="Gagal mengambil data cek RPTAG 0"
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
        source: "all",
      })}
      currencyColumns={["RPPTL", "RPTAG", "RPREDUKSI", "RPDISKON", "RPSELISIH"]}
      fileName="cek-rptag-0"
    />
  );
}
