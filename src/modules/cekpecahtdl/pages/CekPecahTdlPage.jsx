import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getPecahTdl } from "../services/cekPecahTdlService";

export default function getCekPecahTdl({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getPecahTdl }
      errorMessage="Gagal Mengambil data pecah stan tdl"
    />
  );
}
