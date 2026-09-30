import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Divider, Form, Input, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import { loginUser } from "../services/authService";
import { getToken, isLoggedIn, setAuth } from "../utils/authStorage";
import { isTokenExpired } from "../utils/jwt";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();

    if (isLoggedIn() && token && !isTokenExpired(token)) {
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    }
  }, [location.state, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const result = await loginUser({
        username: values.username,
        password: values.password,
      });

      if (result.success) {
        setAuth({
          token: result.data.token,
          user: result.data.user,
        });

        message.success(result.message || "Login berhasil");
        const redirectTo = location.state?.from?.pathname || "/dashboard";
        navigate(redirectTo, { replace: true });
        return;
      }

      message.error(result.message || "Login gagal");
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      message.error(apiMessage || "Server error / login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 28%), linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
        padding: 20,
      }}
    >
      <Card
        bordered={false}
        style={{
          width: 380,
          borderRadius: 8,
          boxShadow: "0 18px 48px rgba(15, 23, 42, 0.10)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Title level={3} style={{ marginBottom: 0, color: "#0f172a" }}>
            Billing for Support
          </Title>
        </div>

        <Divider style={{ margin: "14px 0" }} />

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username wajib diisi" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Masukkan username"
              size="medium"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password wajib diisi" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Masukkan password"
              size="medium"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="medium"
            block
            loading={loading}
            style={{ marginTop: 10 }}
          >
            Login
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Copyright {new Date().getFullYear()} Tim PPBT Icon Plus
          </Text>
        </div>
      </Card>
    </div>
  );
}
