import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getPlgBtsMut } from "../services/cekPlgBtsMutService";

export default function cekPlgBtsMut({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getPlgBtsMut }
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
