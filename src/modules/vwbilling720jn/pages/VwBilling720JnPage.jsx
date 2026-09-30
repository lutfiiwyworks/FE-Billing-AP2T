import DynamicCheckPage from "../../../shared/components/DynamicCheckPage";
import { Select } from "antd";
import { getVwBilling720Jn } from "../services/vwBilling720JnService";

export default function VwBilling720JnPage({ feature }) {
  return (
    <DynamicCheckPage
      feature={feature}
      fetchData={getVwBilling720Jn}
      errorMessage="Gagal mengambil data VW Billing 720 JN"
      extraFilters={[
        {
          name: "kondisi",
          label: "Kondisi",
          component: (
            <Select
              options={[
                { label: "Jamnyala Baru Lebih 720", value: "BR" },
                { label: "Jamnyala Lama Lebih 720", value: "LM" },
              ]}
            />
          ),
        },
      ]}
      initialValues={{ kondisi: "ALL" }}
      currencyColumns={["RPTAG"]}
      fileName="vw-billing-720-jn"
    />
  );
}
