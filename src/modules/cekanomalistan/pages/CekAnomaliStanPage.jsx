import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getAnomaliStan } from "../services/cekAnomaliStanService";

export default function cekPlgCKvarh({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getAnomaliStan}
      errorMessage="Gagal Mengambil Anomali Stan"
    />
  );
}
