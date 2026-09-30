import { Card, Typography } from "antd";

const { Paragraph, Title } = Typography;

export default function CekBillingPage() {
  return (
    <Card bordered={false}>
      <Title level={3}>Cek Billing</Title>
      <Paragraph style={{ marginBottom: 0 }}>
        Halaman Cek Billing sudah tersedia dan bisa dilengkapi logic pencariannya
        berikutnya.
      </Paragraph>
    </Card>
  );
}
