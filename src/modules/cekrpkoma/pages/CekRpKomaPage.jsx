import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getRpKoma } from "../services/cekRpKomaService";

export default function cekRpKoma({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getRpKoma }
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
