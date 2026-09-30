import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getPemkwh0 } from "../services/cekPemkwh0Service";

export default function getPemkwh({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getPemkwh0 }
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
