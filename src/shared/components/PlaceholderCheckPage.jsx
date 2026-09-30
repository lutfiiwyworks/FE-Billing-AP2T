import { ClockCircleOutlined } from "@ant-design/icons";
import { Card, Empty, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

export default function PlaceholderCheckPage({ feature }) {
  return (
    <Card
      title={
        <div style={{ paddingBlock: 4 }}>
          <Title level={4} style={{ margin: 0 }}>
            {feature?.label || "Fitur Baru"}
          </Title>
          {feature?.description ? (
            <Paragraph style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
              {feature.description}
            </Paragraph>
          ) : null}
        </div>
      }
    >
      <div
        style={{
          minHeight: 340,
          display: "grid",
          placeItems: "center",
          padding: "32px 16px",
        }}
      >
        <Empty
          image={
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                margin: "0 auto",
                color: "#0369a1",
                background:
                  "linear-gradient(180deg, rgba(224,242,254,0.92), rgba(240,249,255,0.96))",
                border: "1px solid rgba(3, 105, 161, 0.18)",
              }}
            >
              <ClockCircleOutlined style={{ fontSize: 38 }} />
            </div>
          }
          description={
            <Text strong style={{ color: "#475569", fontSize: 15 }}>
              Halaman sementara, API belum tersedia.
            </Text>
          }
        />
      </div>
    </Card>
  );
}
