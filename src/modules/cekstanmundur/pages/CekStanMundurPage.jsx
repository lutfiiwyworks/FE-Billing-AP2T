import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getStanMundur } from "../services/cekStanMundurService";

export default function CekStanMundur({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getStanMundur}
      errorMessage="Gagal mengambil data cek pelanggan SPEL"
    />
  );
}
