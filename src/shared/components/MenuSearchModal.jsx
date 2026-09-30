import { ArrowRightOutlined, SearchOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Button, Empty, Input, List, Modal, Space, Typography } from "antd";
import { useMemo, useState } from "react";

const { Paragraph, Text } = Typography;

const resultIconStyle = {
  width: 42,
  height: 42,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  fontSize: 18,
};

export default function MenuSearchModal({
  open,
  onClose,
  featureMenus = [],
  onSelectMenu,
  onOpenAll,
  showOpenAll = false,
  title = "Cari Menu",
}) {
  const [keyword, setKeyword] = useState("");

  const searchableMenus = useMemo(
    () => featureMenus.filter((item) => item.label && item.loader),
    [featureMenus],
  );

  const recommendedMenus = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) return searchableMenus;

    return searchableMenus
      .map((item) => {
        const searchableText = [item.key, item.label, item.tabLabel, item.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const label = item.label.toLowerCase();
        const score =
          label.startsWith(normalizedKeyword) ? 3 : searchableText.includes(normalizedKeyword) ? 1 : 0;

        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((first, second) => second.score - first.score || first.label.localeCompare(second.label))
      .slice(0, 12);
  }, [keyword, searchableMenus]);

  const handleClose = () => {
    setKeyword("");
    onClose?.();
  };

  const openMenu = (key) => {
    onSelectMenu?.(key);
    setKeyword("");
    onClose?.();
  };

  return (
    <Modal
      title={title}
      open={open}
      footer={null}
      centered
      width={680}
      onCancel={handleClose}
    >
      <Space direction="vertical" size={18} style={{ width: "100%", paddingTop: 8 }}>
        <Input
          autoFocus
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Ketik nama menu, contoh: PPN, KVARH, PKS, Stan..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onPressEnter={() => {
            if (recommendedMenus[0]) openMenu(recommendedMenus[0].key);
          }}
          allowClear
        />

        <div>
          <Text strong>
            {keyword.trim() ? "Rekomendasi paling cocok" : "Rekomendasi menu"}
          </Text>
          <Paragraph style={{ color: "#64748b", margin: "4px 0 12px" }}>
            Pilih salah satu menu untuk langsung membuka tab kerja.
          </Paragraph>

          {recommendedMenus.length ? (
            <List
              dataSource={recommendedMenus}
              split={false}
              style={{
                maxHeight: 420,
                overflowY: "auto",
                paddingRight: 6,
              }}
              renderItem={(item) => {
                const Icon = item.icon || AppstoreOutlined;

                return (
                  <List.Item
                    onClick={() => openMenu(item.key)}
                    style={{
                      cursor: "pointer",
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      borderRadius: 8,
                      padding: 14,
                      marginBottom: 10,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))",
                    }}
                    actions={[
                      <Button
                        key="open"
                        type="text"
                        icon={<ArrowRightOutlined />}
                        onClick={(event) => {
                          event.stopPropagation();
                          openMenu(item.key);
                        }}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            ...resultIconStyle,
                            background: item.accent,
                            color: item.iconColor,
                          }}
                        >
                          <Icon />
                        </div>
                      }
                      title={<Text strong>{item.label}</Text>}
                      description={item.description}
                    />
                  </List.Item>
                );
              }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Menu tidak ditemukan" />
          )}
        </div>

        {showOpenAll ? (
          <Button
            block
            type="primary"
            onClick={() => {
              onOpenAll?.();
              handleClose();
            }}
          >
            Buka Semua
          </Button>
        ) : null}
      </Space>
    </Modal>
  );
}
