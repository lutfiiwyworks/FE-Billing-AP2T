import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getSelisihRptag } from "../service/cekSelisihRpTagService"; 

export default function cekSelisihRptag({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getSelisihRptag }
      errorMessage="Anomali Selisih Rp Tagihan"
    />
  );
}
