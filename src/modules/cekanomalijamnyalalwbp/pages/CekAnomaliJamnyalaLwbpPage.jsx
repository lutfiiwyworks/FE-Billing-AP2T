import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getAnomaliJamnyalaLwbp } from "../services/cekAnomaliJamnyalaLwbpService";

export default function CekAnomaliJamnyalaLwbpPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getAnomaliJamnyalaLwbp}
      errorMessage="Gagal mengambil data cek anomali jamnyala LWBP"
      fileName="cek-anomali-jamnyala-lwbp"
    />
  );
}
