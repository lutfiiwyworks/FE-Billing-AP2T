import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getSaldoReduksi } from "../service/cekSaldoReduksiService";

export default function CekSaldoReduksi({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getSaldoReduksi}
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
