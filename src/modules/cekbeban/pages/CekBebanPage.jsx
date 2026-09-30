import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekBeban } from "../services/cekBebanService";

export default function CekBebanPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekBeban}
      errorMessage="Gagal mengambil data cek beban"
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
        source: "all",
      })}
      requireThblrek={false}
      fileName="cek-beban"
    />
  );
}
