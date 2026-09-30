import {
  AppstoreAddOutlined,
  CloseOutlined,
  MoreOutlined,
  DownOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Spin, Tabs, Typography } from "antd";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";

import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";
import MenuSearchModal from "../components/MenuSearchModal";
import { featureMenuMap, featureMenus } from "../config/featureMenus";

const { Content } = Layout;
const { Text } = Typography;
const DashboardPage = lazy(() => import("../../modules/dashboard/pages/DashboardPage"));
const lazyPageCache = new Map();

const HOME_TAB = {
  key: "home",
  label: "Dashboard",
  closable: false,
};

const contentStyle = {
  padding: 24,
  background:
    "radial-gradient(circle at top right, rgba(45, 212, 191, 0.14), transparent 24%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
};

const tabContainerStyle = {
  minHeight: "100%",
  background: "rgba(255, 255, 255, 0.86)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: 8,
  padding: 20,
  boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)",
  backdropFilter: "blur(10px)",
};

const stackStyle = {
  display: "grid",
  gap: 18,
};

const workspaceBarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 2000,
  marginBottom: 34,
  paddingTop: 4,
  isolation: "isolate",
};

const workspacePanelStyle = {
  position: "relative",
  overflow: "visible",
  borderRadius: 8,
  border: "1px solid rgba(148, 163, 184, 0.24)",
  background: "rgba(255, 255, 255, 0.96)",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
  backdropFilter: "blur(12px)",
  padding: "18px 20px 16px",
  zIndex: 2001,
};

const hiddenWorkspacePanelStyle = {
  ...workspacePanelStyle,
  width: "min(360px, 100%)",
  minHeight: 34,
  margin: "0 auto",
  padding: "8px 64px",
};

const workspaceHandleStyle = {
  position: "absolute",
  left: "50%",
  bottom: -22,
  transform: "translateX(-50%)",
  width: 92,
  height: 32,
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderTop: 0,
  borderRadius: "0 0 18px 18px",
  background: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.10)",
  color: "#64748b",
  zIndex: 2,
  appearance: "none",
  padding: 0,
};

const gripStyle = {
  opacity: 0.42,
  fontSize: 12,
};

const workspaceHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 32,
  marginBottom: 12,
  position: "relative",
};

const workspaceItemsStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "nowrap",
  overflowX: "auto",
  overflowY: "hidden",
  paddingBlock: 2,
};

const createWorkspaceItemStyle = (isActive) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  border: isActive ? "1px solid #91caff" : "1px solid rgba(148, 163, 184, 0.24)",
  background: isActive ? "#e6f4ff" : "#f8fafc",
  color: isActive ? "#1677ff" : "#475569",
  padding: "8px 12px",
  cursor: "pointer",
  flex: "0 0 auto",
});

const workspaceLabelStyle = (isActive) => ({
  whiteSpace: "nowrap",
  color: isActive ? "#1677ff" : "#475569",
  fontSize: 13,
});

const addMenuGroupStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

const addMenuButtonStyle = {
  borderRadius: 4,
};

const sectionStyle = (isActive) => ({
  border: isActive ? "1px solid rgba(22, 119, 255, 0.24)" : "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: 10,
  overflow: "hidden",
  background: "rgba(255,255,255,0.95)",
  position: "relative",
  zIndex: 1,
  boxShadow: isActive
    ? "0 18px 36px rgba(22, 119, 255, 0.08)"
    : "0 12px 28px rgba(15, 23, 42, 0.06)",
  scrollMarginTop: 190,
});

const sectionBodyStyle = {
  padding: 16,
};

const shellStyle = {
  minHeight: "120vh",
  background: "#e2e8f0",
};

const tabLoadingStyle = {
  minHeight: 320,
  display: "grid",
  placeItems: "center",
};

const getLazyPage = (loader) => {
  if (!loader) return null;

  if (!lazyPageCache.has(loader)) {
    lazyPageCache.set(loader, lazy(loader));
  }

  return lazyPageCache.get(loader);
};

export default function MainLayout() {
  const [layoutMode, setLayoutMode] = useState("tabs");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tabs, setTabs] = useState([HOME_TAB]);
  const [activeKey, setActiveKey] = useState(HOME_TAB.key);
  const [menuSearchOpen, setMenuSearchOpen] = useState(false);
  const [workspaceHidden, setWorkspaceHidden] = useState(false);
  const contentScrollRef = useRef(null);

  const openTab = (key) => {
    if (key === HOME_TAB.key) {
      setActiveKey(HOME_TAB.key);
      return;
    }

    const menu = featureMenuMap.get(key);

    if (!menu) return;

    setTabs((currentTabs) => {
      const tabExists = currentTabs.some((item) => item.key === key);

      if (tabExists) return currentTabs;

      return [
        ...currentTabs,
        {
          key: menu.key,
          label: menu.tabLabel,
        },
      ];
    });
    setActiveKey(key);
  };

  const closeTab = (targetKey) => {
    setTabs((currentTabs) => {
      const nextTabs = currentTabs.filter((tab) => tab.key !== targetKey);

      if (activeKey === targetKey) {
        setActiveKey(nextTabs.at(-1)?.key ?? HOME_TAB.key);
      }

      return nextTabs.length ? nextTabs : [HOME_TAB];
    });
  };

  const clearMenus = () => {
    setTabs([HOME_TAB]);
    setActiveKey(HOME_TAB.key);
  };

  const openAllMenus = () => {
    setTabs([
      HOME_TAB,
      ...featureMenus.map((menu) => ({
        key: menu.key,
        label: menu.tabLabel,
      })),
    ]);
    setActiveKey(featureMenus.at(-1)?.key ?? HOME_TAB.key);
  };

  const tabItems = useMemo(
    () =>
      tabs.map((tab) => {
        if (tab.key === HOME_TAB.key) {
          return {
            ...tab,
            children: (
              <Suspense fallback={<div style={tabLoadingStyle}><Spin size="large" /></div>}>
                <DashboardPage featureMenus={featureMenus} openTab={openTab} />
              </Suspense>
            ),
          };
        }

        const menu = featureMenuMap.get(tab.key);
        const Page = getLazyPage(menu?.loader);

        return {
          ...tab,
          children: Page ? (
            <Suspense fallback={<div style={tabLoadingStyle}><Spin size="large" /></div>}>
              <Page feature={menu} />
            </Suspense>
          ) : null,
        };
      }),
    [tabs],
  );

  const visibleItems = useMemo(() => {
    if (activeKey === HOME_TAB.key) {
      return tabItems.filter((item) => item.key === HOME_TAB.key);
    }

    const openedItems = tabItems.filter((item) => item.key !== HOME_TAB.key);
    return openedItems.length ? openedItems : tabItems.filter((item) => item.key === HOME_TAB.key);
  }, [activeKey, tabItems]);

  const openedTabs = useMemo(
    () => tabs.filter((tab) => tab.key !== HOME_TAB.key),
    [tabs],
  );

  const hasOpenMenus = openedTabs.length > 0;
  const tabMoreMenu = {
    items: [
      {
        key: "clear",
        label: "Hapus semua menu",
        disabled: !hasOpenMenus,
      },
    ],
    onClick: ({ key }) => {
      if (key === "clear") clearMenus();
    },
  };

  useEffect(() => {
    if (!contentScrollRef.current || !activeKey || activeKey === HOME_TAB.key) return;

    const activeSection = contentScrollRef.current.querySelector(`[data-section-key="${activeKey}"]`);

    if (activeSection) {
      activeSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeKey, visibleItems]);

  return (
    <Layout style={shellStyle}>
      {layoutMode === "tabs" ? (
        <AppSidebar
          openTab={openTab}
          activeKey={activeKey}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          featureMenus={featureMenus}
        />
      ) : null}

      <Layout>
        <AppHeader
          layoutMode={layoutMode}
          onToggleLayout={() => setLayoutMode((mode) => (mode === "stack" ? "tabs" : "stack"))}
        />

        <Content style={contentStyle}>
          <div style={tabContainerStyle} ref={contentScrollRef}>
            {layoutMode === "tabs" ? (
              <Tabs
                type="editable-card"
                hideAdd
                activeKey={activeKey}
                onChange={setActiveKey}
                onEdit={(targetKey, action) => {
                  if (action === "remove") closeTab(targetKey);
                }}
                tabBarExtraContent={{
                  right: (
                    <Dropdown menu={tabMoreMenu} trigger={["click"]}>
                      <Button
                        type="text"
                        shape="circle"
                        icon={<MoreOutlined />}
                        aria-label="Menu aksi tab"
                      />
                    </Dropdown>
                  ),
                }}
                items={tabItems}
              />
            ) : (
              <>
                <div style={workspaceBarStyle}>
                  <div style={workspaceHidden ? hiddenWorkspacePanelStyle : workspacePanelStyle}>
                    <button
                      type="button"
                      style={workspaceHandleStyle}
                      onClick={() => setWorkspaceHidden((hidden) => !hidden)}
                      aria-label={workspaceHidden ? "Tampilkan workspace panel" : "Sembunyikan workspace panel"}
                    >
                      <HolderOutlined style={gripStyle} />
                      <DownOutlined
                        style={{
                          fontSize: 11,
                          transform: workspaceHidden ? "rotate(0deg)" : "rotate(180deg)",
                          transition: "transform 160ms ease",
                        }}
                      />
                      <HolderOutlined style={gripStyle} />
                    </button>

                    {!workspaceHidden ? (
                      <div style={workspaceHeaderStyle}>
                        <Text strong style={{ display: "block", fontSize: 13, color: "#1f2937" }}>
                          Workspace Panel
                        </Text>

                        <div style={addMenuGroupStyle}>
                          <Button
                            type="primary"
                            icon={<AppstoreAddOutlined />}
                            onClick={() => setMenuSearchOpen(true)}
                            style={addMenuButtonStyle}
                          >
                            Tambah Menu
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {!workspaceHidden ? (
                      <>
                        <div className="workspace-menu-strip" style={workspaceItemsStyle}>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => openTab(HOME_TAB.key)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                openTab(HOME_TAB.key);
                              }
                            }}
                            style={createWorkspaceItemStyle(activeKey === HOME_TAB.key)}
                          >
                            <Text
                              strong={activeKey === HOME_TAB.key}
                              style={workspaceLabelStyle(activeKey === HOME_TAB.key)}
                            >
                              Dashboard
                            </Text>
                          </div>

                          {openedTabs.map((tab) => {
                            const isActive = tab.key === activeKey;

                            return (
                              <div
                                key={tab.key}
                                role="button"
                                tabIndex={0}
                                onClick={() => openTab(tab.key)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    openTab(tab.key);
                                  }
                                }}
                                style={createWorkspaceItemStyle(isActive)}
                              >
                                <Text strong={isActive} style={workspaceLabelStyle(isActive)}>
                                  {tab.label}
                                </Text>
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<CloseOutlined />}
                                  aria-label={`Tutup ${tab.label}`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    closeTab(tab.key);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {hasOpenMenus ? (
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                            <Button
                              type="link"
                              size="small"
                              onClick={clearMenus}
                              style={{ paddingInline: 4, color: "#64748b" }}
                            >
                              Hapus semua
                            </Button>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>

                <div style={stackStyle}>
                  {visibleItems.map((item) => {
                    const isActive = item.key === activeKey;

                    return (
                      <section
                        key={item.key}
                        data-section-key={item.key}
                        style={sectionStyle(isActive)}
                      >
                        <div style={sectionBodyStyle}>{item.children}</div>
                      </section>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </Content>
      </Layout>

      <MenuSearchModal
        open={menuSearchOpen}
        onClose={() => setMenuSearchOpen(false)}
        featureMenus={featureMenus}
        onSelectMenu={openTab}
        onOpenAll={openAllMenus}
        showOpenAll
        title="Tambah Menu"
      />
    </Layout>
  );
}
