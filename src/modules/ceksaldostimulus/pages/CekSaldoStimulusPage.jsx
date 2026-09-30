import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getSaldoStimulus } from "../services/cekSaldoStimulusService";

export default function CekSaldoStimulusPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getSaldoStimulus}
      errorMessage="Gagal mengambil data cek saldo stimulus"
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
      })}
    />
  );
}
