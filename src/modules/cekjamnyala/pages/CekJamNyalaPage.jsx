import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekJamNyala } from "../services/cekJamNyalaService";

export default function CekJamNyalaPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekJamNyala}
      errorMessage="Gagal mengambil data cek dibawah 40 jam nyala"
      mapParams={(values) => ({
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
        source: "all",
      })}
      requireThblrek={false}
      fileName="cek-dibawah-40-jam-nyala"
    />
  );
}
