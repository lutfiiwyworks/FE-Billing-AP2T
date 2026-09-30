import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getPlgCKvarh } from "../services/cekPlgCKvarhService";

export default function cekPlgCKvarh({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getPlgCKvarh}
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
