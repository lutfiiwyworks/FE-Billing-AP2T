import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getAnomaliKoreksi } from "../services/cekAnomaliKoreksiService";

export default function getAnomaliKoreksiBilling({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getAnomaliKoreksi }
      errorMessage="Gagal pengecekan anomali koreksi billing"
    />
  );
}
