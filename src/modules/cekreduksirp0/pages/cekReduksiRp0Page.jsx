import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekreduksiRp0 } from "../services/cekReduksiRp0Service";

export default function CekReduksiRp0Page({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekreduksiRp0}
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
