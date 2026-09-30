import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekStimulus } from "../services/cekStimulusService";

export default function CekStimulusPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekStimulus}
      errorMessage="Gagal mengambil data cek selisih unsur trans stimulus"
    />
  );
}
