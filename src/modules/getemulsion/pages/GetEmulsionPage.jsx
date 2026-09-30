import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getEmulsion } from "../services/getEmulsionService";


export default function cekEmulsion({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getEmulsion}
      errorMessage="Gagal mengambil Emulsion"
      thblrekMultiple
      showUnitupi={false}
    />
  );
}
