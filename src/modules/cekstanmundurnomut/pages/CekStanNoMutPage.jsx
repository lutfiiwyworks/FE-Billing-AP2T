import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getStanNoMut } from "../services/cekStanNoMutService";

export default function CekGetStanNoMut({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getStanNoMut}
      errorMessage="Gagal mengambil data cek pelanggan SPEL"
    />
  );
}
