import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import ap2tImage from "../../assets/ap2t.jpg";
import MenuSearchModal from "./MenuSearchModal";

const { Sider } = Layout;
const { Text } = Typography;

const menuStyle = {
  background: "transparent",
  borderInlineEnd: "none",
};

const collapseButtonStyle = {
  border: "1px solid #91caff",
  background: "#e6f4ff",
  color: "#1677ff",
  boxShadow: "0 10px 22px rgba(22, 119, 255, 0.12)",
};

export default function AppSidebar({
  openTab,
  activeKey,
  collapsed,
  onToggle,
  featureMenus = [],
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const menuScrollRef = useRef(null);
  const validFeatureMenus = useMemo(
    () => featureMenus.filter((item) => item?.key && item?.label && item?.loader),
    [featureMenus],
  );
  const checkingFeatureMenus = useMemo(
    () => validFeatureMenus.filter((item) => item.key === "getemulsion"),
    [validFeatureMenus],
  );
  const operationalFeatureMenus = useMemo(
    () => validFeatureMenus.filter((item) => item.key !== "getemulsion"),
    [validFeatureMenus],
  );

  const mapFeatureMenuItem = (item) => {
    const Icon = item.icon;

    return {
      key: item.key,
      icon: Icon ? <Icon /> : <AppstoreOutlined />,
      label: item.label,
    };
  };

  const openSearch = () => {
    setSearchOpen(true);
  };

  useEffect(() => {
    if (!menuScrollRef.current || !activeKey || activeKey === "home") return;

    const selectedItem = menuScrollRef.current.querySelector(".ant-menu-item-selected");

    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeKey]);

  return (
    <Sider
      width={280}
      collapsed={collapsed}
      collapsedWidth={84}
      trigger={null}
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #ffffffff 0%, #ffffffff 100%)",
        padding: 20,
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: 18,
            padding: collapsed ? "12px 0 20px" : "12px 12px 20px",
            borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
            textAlign: collapsed ? "center" : "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={ap2tImage}
              alt="AP2T"
              style={{
                width: collapsed ? 48 : "100%",
                maxWidth: collapsed ? 48 : 180,
                height: collapsed ? 48 : 96,
                objectFit: "cover",
                borderRadius: 0
              }}
            />
          </div>
          {!collapsed && (
            <Text
              style={{
                color: "#475569",
                fontSize: 12,
                display: "block",
                textAlign: "center",
                marginTop: 10,
              }}
            >
            
            </Text>
          )}
        </div>

          <Menu
            mode="inline"
            theme="light"
            selectedKeys={[activeKey]}
            inlineCollapsed={collapsed}
            onClick={({ key }) => {
              if (key === "menu-search") {
                openSearch();
                return;
              }

              openTab(key);
            }}
            style={menuStyle}
            items={[
              {
                key: "home",
                icon: <HomeOutlined />,
                label: "Dashboard",
              },
              {
                key: "menu-search",
                icon: <SearchOutlined />,
                label: "Cari Menu",
              },
            ]}
          />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            paddingRight: collapsed ? 0 : 4,
          }}
          ref={menuScrollRef}
        >
          <Menu
            mode="inline"
            theme="light"
            selectedKeys={[activeKey]}
            inlineCollapsed={collapsed}
            onClick={({ key }) => openTab(key)}
            style={menuStyle}
            items={[
              ...(checkingFeatureMenus.length
                ? [
                    {
                      type: "group",
                      label: "Pengecekan",
                      children: checkingFeatureMenus.map(mapFeatureMenuItem),
                    },
                  ]
                : []),
              {
                type: "group",
                label: "Operasional",
                children: operationalFeatureMenus.map(mapFeatureMenuItem),
              },
            ]}
          />
        </div>

        <MenuSearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          featureMenus={validFeatureMenus}
          onSelectMenu={openTab}
        />

        <Button
          type="default"
          shape="circle"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{
            ...collapseButtonStyle,
            position: "absolute",
            right: -16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        />
      </div>
    </Sider>
  );
}
