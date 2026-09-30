import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

export default function DashboardPage({ featureMenus = [], openTab }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 52%, rgba(8, 145, 178, 0.88) 100%)",
          padding: 32,
          borderRadius: 20,
          color: "#fff",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.24)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "auto -80px -90px auto",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
        <Space direction="vertical" size={8} style={{ position: "relative" }}>
          <Text style={{ color: "rgba(255,255,255,0.72)", letterSpacing: 1.4 }}>
            BILLING FOR SUPPORTS
          </Text>
          <Title level={1} style={{ color: "#fff", margin: 0 }}>
            Shortcut Menu Fitur
          </Title>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.84)",
              marginBottom: 0,
              maxWidth: 640,
              fontSize: 16,
            }}
          >
            Akses cepat modul operasional langsung dari dashboard. Semua menu di bawah
            ini juga tetap tersedia dari sidebar.
          </Paragraph>
        </Space>
      </div>

      <div>
        <Title level={4} style={{ marginTop: 0 }}>
          Menu Fitur
        </Title>
        <Row gutter={[16, 16]}>
          {featureMenus.map((item) => {
            const Icon = item.icon;

            return (
              <Col xs={24} sm={12} xl={6} key={item.key}>
                <Card
                  hoverable
                  styles={{
                    body: {
                      padding: 20,
                      display: "grid",
                      gap: 16,
                    },
                  }}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                    minHeight: 220,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 100%)",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      display: "grid",
                      placeItems: "center",
                      background: item.accent,
                      color: item.iconColor,
                      fontSize: 24,
                    }}
                  >
                    <Icon />
                  </div>

                  <div>
                    <Title level={5} style={{ margin: "0 0 8px" }}>
                      {item.label}
                    </Title>
                    <Paragraph style={{ color: "#475569", marginBottom: 0 }}>
                      {item.description}
                    </Paragraph>
                  </div>

                  <Button
                    type="default"
                    icon={<ArrowRightOutlined />}
                    onClick={() => openTab?.(item.key)}
                    style={{ justifySelf: "start" }}
                  >
                    Buka Menu
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
