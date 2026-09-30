import {
  AppstoreOutlined,
  BarsOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Space, Tooltip, Typography } from "antd";

import { logout } from "../../modules/auth/services/authLogout";
import { getUser } from "../../modules/auth/utils/authStorage";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader({
  layoutMode = "tabs",
  onToggleLayout,
}) {
  const user = getUser();
  const isStackMode = layoutMode === "stack";

  return (
    <Header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        height: 64,
        lineHeight: "64px",
        padding: "0 28px",
      }}
    >
      <div>
        <Tooltip title={isStackMode ? "Mode tab biasa" : "Mode stack"}>
          <Button
            type={isStackMode ? "primary" : "default"}
            shape="circle"
            icon={isStackMode ? <BarsOutlined /> : <AppstoreOutlined />}
            onClick={onToggleLayout}
            aria-label={isStackMode ? "Aktifkan mode tab biasa" : "Aktifkan mode stack"}
          />
        </Tooltip>
      </div>

      <Space size={24}>
        <Space size={10}>
          <Avatar
            style={{
              background: "linear-gradient(135deg, #0f766e 0%, #1d4ed8 100%)",
            }}
            icon={<UserOutlined />}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <Text strong style={{ color: "#0f172a" }}>
              {user?.id_user || user?.username || "User"}
            </Text>
            <Text style={{ color: "#64748b", fontSize: 12 }}>Session aktif</Text>
          </div>
        </Space>

        <Button type="text" danger icon={<LogoutOutlined />} onClick={logout}>
          Keluar
        </Button>
      </Space>
    </Header>
  );
}
