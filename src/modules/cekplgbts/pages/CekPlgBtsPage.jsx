import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getPlgBts } from "../services/cekPlgBtsService";

export default function cekPlgBts({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getPlgBts }
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
