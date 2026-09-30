import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekSpel } from "../services/cekSpelService";


export default function CekSpel({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekSpel}
      errorMessage="Gagal mengambil data spel"
    />
  );
}
