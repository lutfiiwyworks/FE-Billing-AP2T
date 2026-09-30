import DynamicCheckPage from "../../../../shared/components/DynamicCheckPage";
import { getReduksiStimulus } from "../service/cekReduksiStimulusService";


export default function CekReduksiStimulus({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getReduksiStimulus}
      errorMessage="Gagal mengambil data Cek Reduksi Nongol lagi"
    />
  );
}
