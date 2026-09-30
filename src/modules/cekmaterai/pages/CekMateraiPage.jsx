import { Select, Typography } from "antd";

import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { getCekMaterai, MATERAI_RULE_OPTIONS } from "../services/cekMateraiService";

const { Text } = Typography;

export default function CekMateraiPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getCekMaterai}
      errorMessage="Gagal mengambil data cek materai"
      initialValues={{
        rule: "MATERAI_5JT",
      }}
      mapParams={(values) => ({
        rule: values.rule,
        thblrek: values.thblrek?.format("YYYYMM"),
        unitupi: values.unitupi?.trim() || undefined,
        idpel: values.idpel?.trim() || undefined,
        source: "all",
      })}
      currencyColumns={["RPMAT", "RPTAG"]}
      extraFilters={[
        {
          name: "rule",
          label: "Rule Materai",
          rules: [{ required: true, message: "Rule wajib dipilih" }],
          lg: 5,
          component: (
            <Select
              placeholder="Pilih rule"
              options={MATERAI_RULE_OPTIONS.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
            />
          ),
        },
        {
          label: "Kriteria",
          lg: 5,
          component: ({ values }) => (
            <Text type="secondary">
              {MATERAI_RULE_OPTIONS.find((item) => item.value === values.rule)?.description || "-"}
            </Text>
          ),
        },
      ]}
      emptyDescription="Pilih rule lalu klik proses"
      submitLabel="Proses"
      fileName="cek-materai"
    />
  );
}
