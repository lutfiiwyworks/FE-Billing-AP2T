import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import {
  exportCekAnomaliHariBaca,
  getCekAnomaliHariBaca,
} from "../services/cekAnomaliHariBacaService";

export default function CekAnomaliHariBacaPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekAnomaliHariBaca}
      errorMessage="Gagal mengambil data anomali hari baca"
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
      })}
      serverPagination
      serverPageSize={100}
      remoteSort
      remoteSearch
      exportData={exportCekAnomaliHariBaca}
      showSourceFilter={false}
      fileName="pengecekan-anomali-hari-baca"
    />
  );
}
