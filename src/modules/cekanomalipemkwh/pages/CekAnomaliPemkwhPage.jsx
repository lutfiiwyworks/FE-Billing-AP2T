import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getAnomaliPemkwh } from "../services/cekAnomaliPemkwhService";

export default function getPemkwh({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getAnomaliPemkwh }
      errorMessage="Anomali Pemakaian kWh"
    />
  );
}
