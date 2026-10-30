import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getChekRpBK } from "../services/CekAnomaliRpBKService";

export default function getRpBK({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getChekRpBK }
      errorMessage="Anomali Pemakaian kWh"
    />
  );
}
