import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getPbPks } from "../services/cekPbPksService";

export default function getCekPbPks({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={ getPbPks }
      errorMessage="CEK PELANGGAN BARU PKS PER IDPEL TAMBAHAN"
    />
  );
}
