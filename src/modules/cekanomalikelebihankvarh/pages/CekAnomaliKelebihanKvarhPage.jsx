import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekAnomaliKelebihanKvarh } from "../services/cekAnomaliKelebihanKvarhService";

export default function CekAnomaliKelebihanKvarhPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekAnomaliKelebihanKvarh}
      errorMessage="Gagal mengambil data cek anomali kelebihan KVARH"
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
        source: "all",
      })}
      fileName="cek-anomali-kelebihan-kvarh"
    />
  );
}
