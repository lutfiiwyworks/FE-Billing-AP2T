import { useState } from "react";
import { Button, Modal, Space, Table, Tooltip, Typography, message } from "antd";
import { DownloadOutlined, ExpandOutlined, FilterFilled } from "@ant-design/icons";
import { getDefaultTablePagination } from "../utils/table";

const { Text } = Typography;

const numberFormatter = new Intl.NumberFormat("id-ID");

const escapeCell = (value) => {
  const stringValue = value === null || value === undefined ? "" : String(value);

  return stringValue
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
};

const getColumnTitle = (column) => {
  if (typeof column.title === "string") return column.title;
  if (typeof column.dataIndex === "string") return column.dataIndex;
  return column.key || "";
};

const getColumnValue = (row, column) => {
  if (Array.isArray(column.dataIndex)) {
    return column.dataIndex.reduce((value, key) => value?.[key], row);
  }

  return row?.[column.dataIndex];
};

const downloadExcelCompatibleFile = ({ rows, columns, fileName }) => {
  const exportColumns = columns.filter((column) => column.dataIndex);
  const headerRow = exportColumns
    .map((column) => `<th>${escapeCell(getColumnTitle(column))}</th>`)
    .join("");

  const bodyRows = rows
    .map((row) => {
      const cells = exportColumns
        .map((column) => `<td style="mso-number-format:'\\@';">${escapeCell(getColumnValue(row, column))}</td>`)
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>${headerRow}</tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");

  link.href = url;
  link.download = `${fileName}-${timestamp}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function DataTableActions({
  rows = [],
  columns = [],
  fileName = "data",
  fullscreenTitle = "Data",
  tableProps = {},
  fullscreenScroll,
  filterMode = false,
  onFilterModeChange,
  filterDisabled = false,
  onExport,
  exportDisabled = false,
}) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!onExport && !rows.length) {
      message.warning("Belum ada data untuk diexport");
      return;
    }

    if (onExport) {
      try {
        setExporting(true);
        await onExport();
      } catch (err) {
        const apiMessage = err?.response?.data?.message;
        message.error(apiMessage || "Gagal export data");
      } finally {
        setExporting(false);
      }
      return;
    }

    downloadExcelCompatibleFile({ rows, columns, fileName });
  };

  return (
    <>
      <Space wrap size={8}>
        {onFilterModeChange ? (
          <Tooltip title={filterMode ? "Sembunyikan filter kolom" : "Tampilkan filter kolom"}>
            <Button
              type="default"
              className={filterMode ? "billing-action-filter-button is-active" : "billing-action-filter-button"}
              icon={<FilterFilled />}
              onClick={() => onFilterModeChange(!filterMode)}
              disabled={filterDisabled}
            />
          </Tooltip>
        ) : null}
        <Tooltip title="Fullscreen table">
          <Button
            icon={<ExpandOutlined />}
            onClick={() => setIsFullscreenOpen(true)}
            disabled={!rows.length}
          />
        </Tooltip>
        <Tooltip title="Export Excel">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={exportDisabled || (!onExport && !rows.length)}
            loading={exporting}
          >
            Export
          </Button>
        </Tooltip>
      </Space>

      <Modal
        open={isFullscreenOpen}
        onCancel={() => setIsFullscreenOpen(false)}
        footer={null}
        title={fullscreenTitle}
        width="100vw"
        className="billing-fullscreen-modal"
        styles={{
          body: { paddingTop: 8 },
          content: { maxWidth: "100vw", top: 0, paddingBottom: 12 },
        }}
      >
        <div className="billing-table-modalbar">
          <Text type="secondary">Menampilkan {numberFormatter.format(rows.length)} baris data</Text>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={exportDisabled || (!onExport && !rows.length)}
            loading={exporting}
          >
            Export
          </Button>
        </div>

        <Table
          {...tableProps}
          columns={columns}
          dataSource={rows}
          pagination={getDefaultTablePagination()}
          scroll={fullscreenScroll || { x: tableProps.scroll?.x || 1200, y: "calc(100vh - 240px)" }}
        />
      </Modal>
    </>
  );
}
