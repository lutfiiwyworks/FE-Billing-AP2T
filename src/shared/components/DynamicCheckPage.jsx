import {
  CheckCircleOutlined,
  CloseOutlined,
  FilterFilled,
  ReloadOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Popover,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import DataTableActions from "./DataTableActions";
import { getDefaultTablePagination } from "../utils/table";

const { Paragraph, Text, Title } = Typography;

const numberFormatter = new Intl.NumberFormat("id-ID", {
  useGrouping: false,
  maximumFractionDigits: 20,
});
const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const sourceLabelMap = {
  oracle: "AP2T",
  postgres: "New AP2T",
};

const defaultPinnedColumnOrder = ["source", "THBLREK", "UNITUPI", "IDPEL", "TARIF", "DAYA"];
const defaultFixedLeftColumns = ["source", "THBLREK", "IDPEL"];

const getDefaultFormValues = () => {
  const today = dayjs();

  return {
    thblrek: today.date() > 20 ? today.add(1, "month") : today,
  };
};

const normalizeRowKeys = (row = {}) => {
  const normalizedRow = Object.entries(row).reduce((result, [key, value]) => {
    const normalizedKey = key.toLowerCase() === "source" ? "source" : key.toUpperCase();
    result[normalizedKey] = value;
    return result;
  }, {});

  normalizedRow.source = row?.source ?? row?.SOURCE ?? normalizedRow.source ?? "";

  return normalizedRow;
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const compareNumbers = (left, right) => parseDbNumber(left || 0) - parseDbNumber(right || 0);

const compareText = (left, right) =>
  normalizeValue(left).localeCompare(normalizeValue(right), "id", {
    numeric: true,
    sensitivity: "base",
  });

const renderEmpty = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const renderDateValue = (value) => {
  if (typeof value !== "string") return value;

  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}/);
  return match ? match[1] : value;
};

const parseDbNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number(value);

  const text = value.trim();
  if (!text) return Number.NaN;

  const hasComma = text.includes(",");
  const hasDot = text.includes(".");

  if (hasComma && hasDot) {
    const decimalSeparator = text.lastIndexOf(",") > text.lastIndexOf(".") ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    return Number(text.replaceAll(groupingSeparator, "").replace(decimalSeparator, "."));
  }

  if (hasComma) {
    return Number(text.replace(",", "."));
  }

  if (hasDot) {
    const parts = text.split(".");
    const looksGrouped = parts.length > 2 && parts.slice(1).every((part) => part.length === 3);
    return Number(looksGrouped ? text.replaceAll(".", "") : text);
  }

  return Number(text);
};

const formatNumberValue = (value) => {
  return numberFormatter.format(parseDbNumber(value));
};

const isNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return false;
  return !Number.isNaN(parseDbNumber(value));
};

const isRawColumn = (column, rawColumns) => {
  if (rawColumns.includes(column)) return true;

  return (
    column.includes("ID") ||
    column.includes("NOMOR") ||
    column.includes("NO_") ||
    column.includes("UNIT") ||
    column.includes("KD") ||
    column.includes("KODE") ||
    column.startsWith("THBL") ||
    column.startsWith("TGL")
  );
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getColumnWidth = (column, columnWidths, rows = []) => {
  if (columnWidths[column]) return columnWidths[column];

  const values = rows
    .slice(0, 80)
    .map((row) => row[column])
    .filter((value) => value !== null && value !== undefined && value !== "");
  const longestTextLength = Math.max(
    column.length,
    ...values.map((value) => String(value).length),
  );
  const contentWidth = longestTextLength * 9 + 44;

  if (column === "source") return 120;
  if (column === "IDPEL") return clamp(contentWidth, 160, 260);
  if (column.startsWith("RPPPN") || column.startsWith("RP")) return clamp(contentWidth, 180, 260);
  if (column.length > 18) return clamp(contentWidth, 210, 360);
  return clamp(contentWidth, 130, 280);
};

const resolveProp = (value, context) => {
  if (typeof value === "function") {
    return value(context);
  }

  return value;
};

const defaultMapParams = (values) => {
  const { thblrek, unitupi, idpel, ...rest } = values;

  return {
    ...rest,
    thblrek: formatThblrekParam(thblrek),
    unitupi: unitupi?.trim?.() || undefined,
    idpel: idpel?.trim?.() || undefined,
  };
};

const formatThblrekParam = (value) => {
  if (Array.isArray(value)) {
    const formattedValues = value
      .map((item) => (item?.format ? item.format("YYYYMM") : item))
      .filter(Boolean);

    return formattedValues.length ? formattedValues.join(",") : undefined;
  }

  return value?.format ? value.format("YYYYMM") : value;
};

const sortThblrekValues = (value) => {
  if (!Array.isArray(value)) return value;

  return [...value]
    .filter(Boolean)
    .sort((left, right) => right.valueOf() - left.valueOf());
};

const normalizeArrayFilter = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
};

const getFilterValueKey = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const getMinimumColumnWidth = (label) => Math.max(120, String(label).length * 9 + 72);

function ColumnValueFilter({
  column,
  label,
  options = [],
  value,
  onChange,
  onSort,
  onHideColumn,
  canHide,
  isNumberColumn,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedValues = normalizeArrayFilter(value);
  const [draftValues, setDraftValues] = useState([]);
  const effectiveDraftValues = draftValues;
  const selectedSet = useMemo(() => new Set(effectiveDraftValues), [effectiveDraftValues]);
  const filteredOptions = useMemo(() => {
    const keyword = normalizeValue(search);

    if (!keyword) return options;

    return options.filter((option) => normalizeValue(option.label).includes(keyword));
  }, [options, search]);
  const isFiltered = value !== undefined;
  const allVisibleSelected =
    filteredOptions.length > 0 && filteredOptions.every((option) => selectedSet.has(option.value));
  const applyFilterValues = (nextValues) => {
    const uniqueValues = Array.from(new Set(nextValues));
    const allValueCount = options.length;

    onChange(column, uniqueValues.length < allValueCount ? uniqueValues : undefined);
  };

  const handleToggle = (filterValue, checked) => {
    setDraftValues((currentValues) => {
      return checked
        ? [...currentValues, filterValue]
        : currentValues.filter((selectedValue) => selectedValue !== filterValue);
    });
  };

  const handleToggleVisible = () => {
    if (allVisibleSelected) {
      const visibleValueSet = new Set(filteredOptions.map((option) => option.value));
      setDraftValues((currentValues) => {
        return currentValues.filter((selectedValue) => !visibleValueSet.has(selectedValue));
      });
      return;
    }

    setDraftValues((currentValues) =>
      Array.from(new Set([...currentValues, ...filteredOptions.map((option) => option.value)])),
    );
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setDraftValues(isFiltered ? selectedValues : options.map((option) => option.value));
      setSearch("");
    }
  };

  const menu = (
    <div className="billing-excel-filter-menu" onClick={(event) => event.stopPropagation()}>
      <Text strong className="billing-excel-filter-title">{label}</Text>

      <Button
        type="text"
        size="small"
        className="billing-excel-filter-command"
        icon={<SortAscendingOutlined />}
        onClick={() => onSort(column, "ascend")}
      >
        {isNumberColumn ? "Sort Smallest to Largest" : "Sort A to Z"}
      </Button>
      <Button
        type="text"
        size="small"
        className="billing-excel-filter-command"
        icon={<SortDescendingOutlined />}
        onClick={() => onSort(column, "descend")}
      >
        {isNumberColumn ? "Sort Largest to Smallest" : "Sort Z to A"}
      </Button>
      <Button
        type="text"
        size="small"
        className="billing-excel-filter-command"
        icon={<CloseOutlined />}
        onClick={() => onHideColumn(column)}
        disabled={!canHide}
      >
        Hide Column
      </Button>

      <div className="billing-excel-filter-divider" />

      <Button
        type="text"
        size="small"
        className="billing-excel-filter-command"
        icon={<FilterFilled />}
        onClick={() => onChange(column, undefined)}
        disabled={!isFiltered}
      >
        Clear Filter From "{label}"
      </Button>
      <Input
        allowClear
        size="small"
        placeholder="Search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <Space size={8} className="billing-excel-filter-actions">
        <Button type="link" size="small" onClick={handleToggleVisible}>
          {allVisibleSelected ? "Unselect visible" : "Select visible"}
        </Button>
      </Space>

      <div className="billing-excel-filter-options">
        {filteredOptions.map((option) => (
          <Checkbox
            key={option.value}
            checked={selectedSet.has(option.value)}
            onChange={(event) => handleToggle(option.value, event.target.checked)}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>

      <div className="billing-excel-filter-footer">
        <Button
          type="primary"
          size="small"
          onClick={() => {
            applyFilterValues(effectiveDraftValues);
            setOpen(false);
          }}
        >
          OK
        </Button>
        <Button
          size="small"
          onClick={() => {
            setDraftValues(isFiltered ? selectedValues : options.map((option) => option.value));
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      content={menu}
      trigger="click"
      placement="bottomLeft"
      arrow={{ pointAtCenter: true }}
      overlayClassName="billing-excel-filter-popover"
    >
      <Button
        type="text"
        size="small"
        className={isFiltered ? "billing-table-filter-arrow is-active" : "billing-table-filter-arrow"}
      >
        ▾
      </Button>
    </Popover>
  );
}

function ColumnHeader({
  column,
  label,
  filterOptions,
  filterValue,
  filterMode,
  onFilterChange,
  onHideColumn,
  onSort,
  onResizeColumn,
  canHide,
  isNumberColumn,
}) {
  return (
    <span className="billing-table-head">
      <span className="billing-table-head-label">{label}</span>
      <span className="billing-table-head-actions">
        {filterMode ? (
          <ColumnValueFilter
            column={column}
            label={label}
            options={filterOptions}
            value={filterValue}
            onChange={onFilterChange}
            onSort={onSort}
            onHideColumn={onHideColumn}
            canHide={canHide}
            isNumberColumn={isNumberColumn}
          />
        ) : null}
      </span>
      <span
        className="billing-column-resize-handle"
        role="separator"
        aria-label={`Resize ${label}`}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();

          const startX = event.clientX;
          const startWidth = event.currentTarget.closest("th")?.offsetWidth || getMinimumColumnWidth(label);

          const handlePointerMove = (moveEvent) => {
            onResizeColumn(column, Math.max(getMinimumColumnWidth(label), startWidth + moveEvent.clientX - startX));
          };
          const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
          };

          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener("pointerup", handlePointerUp);
        }}
      />
    </span>
  );
}

const normalEmptyImage = (
  <div
    style={{
      width: 72,
      height: 72,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      margin: "0 auto",
      color: "#16a34a",
      background: "linear-gradient(180deg, rgba(220,252,231,0.92), rgba(240,253,244,0.96))",
      border: "1px solid rgba(22, 163, 74, 0.18)",
    }}
  >
    <CheckCircleOutlined style={{ fontSize: 38 }} />
  </div>
);

const emptyStateStyle = {
  minHeight: 280,
  display: "grid",
  placeItems: "center",
  padding: "32px 16px",
};

const checkPageStateCache = new Map();

export default function DynamicCheckPage({
  feature,
  title,
  description,
  fetchData,
  errorMessage,
  extraFilters = [],
  initialValues = {},
  mapParams = defaultMapParams,
  normalizeRow = normalizeRowKeys,
  pinnedColumnOrder = defaultPinnedColumnOrder,
  fixedLeftColumns = defaultFixedLeftColumns,
  rawColumns = [],
  currencyColumns = [],
  columnWidths = {},
  fileName,
  fullscreenTitle,
  emptyDescription = "Pilih parameter pengecekan, lalu jalankan pencarian",
  searchedEmptyDescription = "Tidak ditemukan data anomali",
  submitLabel = "Cari",
  resetLabel = "Reset",
  rowKey,
  requireThblrek = true,
  thblrekMultiple = false,
  showThblrekShortcuts = false,
  requireIdpel = false,
  showUnitupi = true,
  showIdpel = true,
  serverPagination = false,
  serverPageSize = 1000,
  remoteSort = false,
  remoteSearch = false,
  exportData,
}) {
  const [form] = Form.useForm();
  const resolvedTitle = title || feature?.label || "Data";

  const resolvedInitialValues = useMemo(() => {
    const values = {
      ...getDefaultFormValues(),
      ...initialValues,
    };

    if (thblrekMultiple && values.thblrek && !Array.isArray(values.thblrek)) {
      values.thblrek = [values.thblrek];
    }

    return values;
  }, [initialValues, thblrekMultiple]);

  const cacheKey = feature?.key || resolvedTitle;
  const cachedState = checkPageStateCache.get(cacheKey);
  const initialFormValues = cachedState?.formValues || resolvedInitialValues;

  const watchedFormValues = Form.useWatch([], form);
  const watchedValues = useMemo(() => watchedFormValues || {}, [watchedFormValues]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [rows, setRows] = useState(() => cachedState?.rows || []);
  const [total, setTotal] = useState(() => cachedState?.total || 0);
  const [searched, setSearched] = useState(() => cachedState?.searched || false);
  const [columnFilters, setColumnFilters] = useState(() => cachedState?.columnFilters || {});
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => cachedState?.visibleColumnKeys);
  const [filterMode, setFilterMode] = useState(() => cachedState?.filterMode || false);
  const [sortState, setSortState] = useState(() => cachedState?.sortState);
  const [customColumnWidths, setCustomColumnWidths] = useState(() => cachedState?.customColumnWidths || {});
  const [serverPage, setServerPage] = useState(() => cachedState?.serverPage || 1);
  const [serverLimit, setServerLimit] = useState(() => cachedState?.serverLimit || serverPageSize);
  const [searchKeyword, setSearchKeyword] = useState(() => cachedState?.searchKeyword || "");
  const [selectedColumnKeys, setSelectedColumnKeys] = useState([]);
  const lastDebouncedSearchRef = useRef(searchKeyword);
  const loadingCompletionTimeoutRef = useRef();

  useEffect(() => {
    return () => {
      window.clearTimeout(loadingCompletionTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!loading) return undefined;

    setLoadingProgress((currentProgress) => (currentProgress > 0 ? currentProgress : 3));

    const intervalId = window.setInterval(() => {
      setLoadingProgress((currentProgress) => {
        if (currentProgress >= 92) return currentProgress;

        const step = currentProgress < 35 ? 9 : currentProgress < 70 ? 5 : 2;
        return Math.min(currentProgress + step, 92);
      });
    }, 320);

    return () => window.clearInterval(intervalId);
  }, [loading]);

  useEffect(() => {
    checkPageStateCache.set(cacheKey, {
      rows,
      total,
      searched,
      columnFilters,
      visibleColumnKeys,
      filterMode,
      sortState,
      customColumnWidths,
      serverPage,
      serverLimit,
      searchKeyword,
      formValues: form.getFieldsValue(true),
    });
  }, [
    cacheKey,
    columnFilters,
    customColumnWidths,
    filterMode,
    form,
    rows,
    searched,
    searchKeyword,
    sortState,
    serverLimit,
    serverPage,
    total,
    visibleColumnKeys,
    watchedValues,
  ]);

  const dynamicColumnKeys = useMemo(() => {
    const keys = rows.reduce((result, row) => {
      Object.keys(row).forEach((key) => result.add(key));
      return result;
    }, new Set());

    return [
      ...pinnedColumnOrder.filter((column) => keys.has(column)),
      ...Array.from(keys).filter((column) => !pinnedColumnOrder.includes(column)),
    ];
  }, [pinnedColumnOrder, rows]);

  const filterOptionsByColumn = useMemo(
    () =>
      dynamicColumnKeys.reduce((result, column) => {
        const valueMap = rows.reduce((map, row) => {
          const value = row[column];
          const key = getFilterValueKey(value);

          if (!map.has(key)) {
            map.set(key, {
              label: column === "source" ? sourceLabelMap[value] || value || "-" : renderEmpty(value),
              value: key,
              rawValue: value,
            });
          }

          return map;
        }, new Map());

        result[column] = Array.from(valueMap.values())
          .sort((left, right) => compareText(left.label, right.label))
          .map(({ label, value }) => ({ label, value }));

        return result;
      }, {}),
    [dynamicColumnKeys, rows],
  );

  const handleColumnFilterChange = useCallback((column, nextValue) => {
    setColumnFilters((currentFilters) => {
      const nextFilters = { ...currentFilters };

      if (nextValue !== undefined) {
        nextFilters[column] = nextValue;
      } else {
        delete nextFilters[column];
      }

      return nextFilters;
    });
  }, []);

  const handleHideColumn = useCallback((hiddenColumn) => {
    setVisibleColumnKeys((currentColumns) => {
      const currentVisibleColumns = currentColumns === undefined
        ? dynamicColumnKeys
        : normalizeArrayFilter(currentColumns);

      return currentVisibleColumns.filter((visibleColumn) => visibleColumn !== hiddenColumn);
    });
  }, [dynamicColumnKeys]);

  const handleSortChange = useCallback((column, direction) => {
    setSortState({ column, direction });
  }, []);

  const handleColumnResize = useCallback((column, width) => {
    setCustomColumnWidths((currentWidths) => ({
      ...currentWidths,
      [column]: Math.round(width),
    }));
  }, []);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        Object.entries(columnFilters).every(([column, selectedValues]) => {
          const normalizedSelectedValues = normalizeArrayFilter(selectedValues);

          return normalizedSelectedValues.includes(getFilterValueKey(row[column]));
        }),
      ),
    [columnFilters, rows],
  );

  const sortedRows = useMemo(() => {
    if (remoteSort) return filteredRows;

    if (!sortState?.column || !sortState?.direction) return filteredRows;

    const sortedData = [...filteredRows];
    const column = sortState.column;
    const values = rows
      .map((row) => row[column])
      .filter((value) => value !== null && value !== undefined && value !== "");
    const textColumn = isRawColumn(column, rawColumns);
    const isNumberColumn = !textColumn && values.length > 0 && values.every(isNumericValue);

    sortedData.sort((left, right) => {
      const result = isNumberColumn
        ? compareNumbers(left[column], right[column])
        : compareText(left[column], right[column]);

      return sortState.direction === "descend" ? result * -1 : result;
    });

    return sortedData;
  }, [filteredRows, rawColumns, remoteSort, rows, sortState]);

  const effectiveVisibleColumnKeys = useMemo(() => {
    if (visibleColumnKeys === undefined) return dynamicColumnKeys;

    return normalizeArrayFilter(visibleColumnKeys).filter((column) =>
      dynamicColumnKeys.includes(column),
    );
  }, [dynamicColumnKeys, visibleColumnKeys]);

  const columns = useMemo(
    () =>
      dynamicColumnKeys.map((column) => {
        const label = column === "source" ? "Source" : column;
        const values = rows
          .map((row) => row[column])
          .filter((value) => value !== null && value !== undefined && value !== "");
        const textColumn = isRawColumn(column, rawColumns);
        const isNumberColumn = !textColumn && values.length > 0 && values.every(isNumericValue);
        const width = customColumnWidths[column] ||
          Math.max(getMinimumColumnWidth(label), getColumnWidth(column, columnWidths, rows));

        return {
          title: (
            <ColumnHeader
              column={column}
              label={label}
              filterOptions={filterOptionsByColumn[column] || []}
              filterValue={columnFilters[column]}
              filterMode={filterMode}
              onFilterChange={handleColumnFilterChange}
              onHideColumn={handleHideColumn}
              onSort={handleSortChange}
              onResizeColumn={handleColumnResize}
              canHide={effectiveVisibleColumnKeys.length > 1}
              isNumberColumn={isNumberColumn}
            />
          ),
          dataIndex: column,
          key: column,
          width,
          fixed: fixedLeftColumns.includes(column) ? "left" : undefined,
          align: isNumberColumn ? "right" : undefined,
          sorter: remoteSort ? true : undefined,
          sortOrder: sortState?.column === column ? sortState.direction : undefined,
          render: (value) => {
            if (column === "source") {
              return (
                <Tag color={value === "oracle" ? "gold" : "blue"}>
                  {sourceLabelMap[value] || value || "-"}
                </Tag>
              );
            }

            if (!isNumberColumn) {
              return <span style={{ whiteSpace: "nowrap" }}>{renderEmpty(renderDateValue(value))}</span>;
            }
            if (currencyColumns.includes(column) || column.startsWith("RP") || column.startsWith("DPP") || column.startsWith("PPN")) {
              return value === null || value === undefined
                ? "-"
                : currencyFormatter.format(parseDbNumber(value || 0));
            }

            return value === null || value === undefined
              ? "-"
              : formatNumberValue(value);
          },
        };
      }),
    [
      columnFilters,
      columnWidths,
      customColumnWidths,
      currencyColumns,
      dynamicColumnKeys,
      effectiveVisibleColumnKeys.length,
      filterOptionsByColumn,
      filterMode,
      fixedLeftColumns,
      handleColumnResize,
      handleColumnFilterChange,
      handleHideColumn,
      handleSortChange,
      rawColumns,
      remoteSort,
      rows,
      sortState,
    ],
  );

  const columnOptions = useMemo(
    () =>
      dynamicColumnKeys.map((column) => ({
        label: column === "source" ? "Source" : column,
        value: column,
      })),
    [dynamicColumnKeys],
  );

  const visibleColumns = useMemo(
    () => {
      const fixedColumnSet = new Set(fixedLeftColumns);
      const selectedColumnSet = new Set(selectedColumnKeys);

      return columns.filter((column) => {
        if (!effectiveVisibleColumnKeys.includes(column.key)) return false;
        if (!filterMode || !selectedColumnSet.size) return true;
        if (fixedColumnSet.has(column.key)) return true;

        return selectedColumnSet.has(column.key);
      });
    },
    [columns, effectiveVisibleColumnKeys, filterMode, fixedLeftColumns, selectedColumnKeys],
  );

  const hiddenColumnKeys = useMemo(
    () => dynamicColumnKeys.filter((column) => !effectiveVisibleColumnKeys.includes(column)),
    [dynamicColumnKeys, effectiveVisibleColumnKeys],
  );

  const activeFilterCount = useMemo(() => {
    return Object.keys(columnFilters).length;
  }, [columnFilters]);

  const resolveTotal = useCallback((result, dataLength) =>
    result?.total ||
    result?.meta?.total ||
    result?.pagination?.total ||
    result?.totalData ||
    result?.totalRecords ||
    result?.count ||
    dataLength, []);

  const getRequestParams = useCallback((values, page, limit, nextSortState, nextSearchKeyword) => {
    const baseParams = mapParams(values);

    if (!serverPagination) return baseParams;

    const params = {
      ...baseParams,
      limit,
      page,
    };
    const trimmedSearch = nextSearchKeyword?.trim?.();

    if (remoteSort && nextSortState?.column && nextSortState?.direction) {
      params.sortField = nextSortState.column;
      params.sortOrder = nextSortState.direction === "descend" ? "DESC" : "ASC";
    }

    if (remoteSearch && trimmedSearch) {
      params.search = trimmedSearch;
    }

    return params;
  }, [mapParams, remoteSearch, remoteSort, serverPagination]);

  const handleSearch = useCallback(async (
    values,
    page = 1,
    limit = serverLimit,
    nextSortState = sortState,
    nextSearchKeyword = searchKeyword,
  ) => {
    try {
      window.clearTimeout(loadingCompletionTimeoutRef.current);
      setLoadingProgress(0);
      setLoading(true);

      const params = getRequestParams(values, page, limit, nextSortState, nextSearchKeyword);
      const result = await fetchData(params, values);
      const responseRows = Array.isArray(result) ? result : result?.data || result?.rows;
      const data = Array.isArray(responseRows) ? responseRows.map((item) => normalizeRow(item)) : [];

      setRows(data);
      setTotal(resolveTotal(result, data.length));
      setSearched(true);
      setServerPage(page);
      setServerLimit(limit);
      setSortState(nextSortState);
      setColumnFilters({});
      setVisibleColumnKeys(undefined);

      if (!data.length) {
        message.success("Tidak ditemukan data anomali");
      }
    } catch (err) {
      setRows([]);
      setTotal(0);
      setSearched(true);

      const apiMessage = err?.response?.data?.message;
      message.error(apiMessage || errorMessage || `Gagal mengambil data ${resolvedTitle}`);
    } finally {
      setLoadingProgress(100);
      loadingCompletionTimeoutRef.current = window.setTimeout(() => {
        setLoading(false);
      }, 280);
    }
  }, [
    errorMessage,
    fetchData,
    getRequestParams,
    normalizeRow,
    resolveTotal,
    resolvedTitle,
    searchKeyword,
    serverLimit,
    sortState,
  ]);

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue(resolvedInitialValues);
    setRows([]);
    setTotal(0);
    setServerPage(1);
    setServerLimit(serverPageSize);
    setSearchKeyword("");
    lastDebouncedSearchRef.current = "";
    setColumnFilters({});
    setVisibleColumnKeys(undefined);
    setFilterMode(false);
    setSelectedColumnKeys([]);
    setSortState(undefined);
    setCustomColumnWidths({});
    setSearched(false);
  };

  const handleThblrekShortcut = (monthsCount) => {
    const currentValue = form.getFieldValue("thblrek");

    if (!thblrekMultiple) {
      form.setFieldsValue({
        thblrek: dayjs().startOf("month").subtract(monthsCount, "month"),
      });
      return;
    }

    const selectedValues = Array.isArray(currentValue)
      ? currentValue.filter(Boolean)
      : currentValue
        ? [currentValue]
        : [];
    const shortcutValues = Array.from({ length: monthsCount + 1 }, (_, index) =>
      dayjs().startOf("month").subtract(index, "month"),
    );
    const valuesByMonth = new Map(
      [...selectedValues, ...shortcutValues].map((value) => [value.format("YYYYMM"), value]),
    );

    form.setFieldsValue({ thblrek: sortThblrekValues(Array.from(valuesByMonth.values())) });
  };

  useEffect(() => {
    if (!serverPagination || !remoteSearch || !searched) return undefined;
    if (lastDebouncedSearchRef.current === searchKeyword) return undefined;

    const timeoutId = window.setTimeout(() => {
      lastDebouncedSearchRef.current = searchKeyword;
      handleSearch(form.getFieldsValue(true), 1, serverLimit, sortState, searchKeyword);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [form, handleSearch, remoteSearch, searched, searchKeyword, serverLimit, serverPagination, sortState]);

  const handleRemoteExport = exportData
    ? () => {
        const params = getRequestParams(
          form.getFieldsValue(true),
          serverPage,
          serverLimit,
          sortState,
          searchKeyword,
        );
        const exportParams = { ...params };
        delete exportParams.page;
        delete exportParams.limit;

        return exportData(exportParams);
      }
    : undefined;

  const resolvedFileName =
    resolveProp(fileName, { values: watchedValues, title: resolvedTitle }) ||
    resolvedTitle.toLowerCase().replaceAll(" ", "-");
  const resolvedFullscreenTitle =
    resolveProp(fullscreenTitle, { values: watchedValues, title: resolvedTitle }) || `Data ${resolvedTitle}`;
  const resolvedEmptyDescription =
    resolveProp(emptyDescription, { values: watchedValues, title: resolvedTitle }) ||
    "Pilih parameter pengecekan, lalu jalankan pencarian";
  const resolvedSearchedEmptyDescription =
    resolveProp(searchedEmptyDescription, { values: watchedValues, title: resolvedTitle }) || "Tidak ditemukan data anomali";
  const resolvedSubmitLabel =
    resolveProp(submitLabel, { values: watchedValues, title: resolvedTitle }) || "Cari";
  const resolvedResetLabel =
    resolveProp(resetLabel, { values: watchedValues, title: resolvedTitle }) || "Reset";
  const resolvedDescription =
    description ?? feature?.description;
  const tableLoadingIndicator = (
    <div className="billing-loading-state">
      <div className="billing-loading-progress">
        <Progress
          type="circle"
          percent={loadingProgress}
          size={76}
          strokeColor="#1677ff"
          trailColor="#dbeafe"
          format={(percent) => `${Math.round(percent || 0)}%`}
        />
      </div>
      <div className="billing-loading-copy">
        <span className="billing-loading-title">
          Dalam proses ambil data
        </span>
        <span className="billing-loading-subtitle">
          Sedang mengambil dan menyiapkan data, mohon tunggu sebentar.
        </span>
      </div>
    </div>
  );

  const tableProps = {
    rowKey:
      rowKey ||
      ((record, index) => `${record.source || ""}-${record.THBLREK || ""}-${record.IDPEL || ""}-${index}`),
    columns: visibleColumns,
    dataSource: sortedRows,
    loading: false,
    size: "small",
    pagination: serverPagination
      ? {
          current: serverPage,
          pageSize: serverLimit,
          total,
          showSizeChanger: true,
          pageSizeOptions: [100, 500, 1000],
        }
      : getDefaultTablePagination(),
    scroll: {
      x: Math.max(900, visibleColumns.reduce((totalWidth, column) => totalWidth + (column.width || 150), 0)),
      y: 520,
    },
    onChange: (pagination, __, sorter) => {
      const nextSortState = sorter?.columnKey && sorter?.order
        ? { column: sorter.columnKey, direction: sorter.order }
        : undefined;
      const sortChanged =
        remoteSort &&
        (nextSortState?.column !== sortState?.column ||
          nextSortState?.direction !== sortState?.direction);

      if (serverPagination) {
        const nextPage = pagination?.current || 1;
        const nextLimit = pagination?.pageSize || serverLimit;

        if (nextPage !== serverPage || nextLimit !== serverLimit || sortChanged) {
          handleSearch(
            form.getFieldsValue(true),
            sortChanged ? 1 : nextPage,
            nextLimit,
            remoteSort ? nextSortState : sortState,
            searchKeyword,
          );
          return;
        }
      }

      if (!nextSortState) {
        setSortState(undefined);
        return;
      }

      setSortState(nextSortState);
    },
  };

  return (
    <Card
      title={
        <div style={{ paddingBlock: 4 }}>
          <Title level={4} style={{ margin: 0 }}>
            {resolvedTitle}
          </Title>
          {resolvedDescription ? (
            <Paragraph style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
              {resolvedDescription}
            </Paragraph>
          ) : null}
        </div>
      }
      extra={
        searched ? (
          <Text type="secondary">
            {serverPagination ? "Data tampil" : "Total data"}: {numberFormatter.format(filteredRows.length)}
            {filteredRows.length !== total ? ` dari ${numberFormatter.format(total)}` : ""}
          </Text>
        ) : null
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialFormValues}
        onFinish={handleSearch}
      >
        <Row gutter={[12, 0]} align="bottom">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label="THBLREK"
              name="thblrek"
              normalize={sortThblrekValues}
              rules={
                requireThblrek ? [{ required: true, message: "THBLREK wajib dipilih" }] : undefined
              }
            >
              <DatePicker
                picker="month"
                multiple={thblrekMultiple}
                format="YYYYMM"
                placeholder={thblrekMultiple ? "Pilih bulan rekening" : "Pilih bulan rekening"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {showUnitupi ? (
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item label="UNITUPI" name="unitupi">
                <Input placeholder="Opsional" allowClear />
              </Form.Item>
            </Col>
          ) : null}

          {showIdpel ? (
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item
                label="IDPEL"
                name="idpel"
                rules={requireIdpel ? [{ required: true, message: "IDPEL wajib diisi" }] : undefined}
              >
                <Input placeholder={requireIdpel ? "Wajib diisi" : "Opsional"} allowClear />
              </Form.Item>
            </Col>
          ) : null}

          {showThblrekShortcuts ? (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Shortcut THBLREK">
                <Space wrap size={6}>
                  <Button
                    size="small"
                    htmlType="button"
                    onClick={() => handleThblrekShortcut(3)}
                  >
                    3 Bulan
                  </Button>
                  <Button
                    size="small"
                    htmlType="button"
                    onClick={() => handleThblrekShortcut(6)}
                  >
                    6 Bulan
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          ) : null}

          {extraFilters.map((filter) => {
            const content =
              typeof filter.component === "function"
                ? filter.component({ form, values: watchedValues })
                : filter.component;

            return (
              <Col
                key={filter.name || filter.label}
                xs={24}
                sm={12}
                md={filter.md || 8}
                lg={filter.lg || 5}
              >
                <Form.Item
                  label={filter.label}
                  name={filter.name}
                  rules={filter.rules}
                >
                  {content}
                </Form.Item>
              </Col>
            );
          })}
        </Row>

        <div className="billing-table-toolbar">
          <Space wrap size={8}>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
              {resolvedSubmitLabel}
            </Button>
            <Button htmlType="button" onClick={handleReset} disabled={loading} icon={<ReloadOutlined />}>
              {resolvedResetLabel}
            </Button>
            {remoteSearch ? (
              <Input
                allowClear
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Search"
                disabled={loading}
                style={{ width: 260 }}
              />
            ) : null}
            {filterMode ? (
              <Select
                allowClear
                mode="multiple"
                showSearch
                maxTagCount="responsive"
                optionFilterProp="label"
                value={selectedColumnKeys}
                onChange={setSelectedColumnKeys}
                placeholder="Pilih kolom"
                disabled={loading || !rows.length}
                options={columnOptions}
                suffixIcon={<SearchOutlined />}
                style={{ minWidth: 260, maxWidth: 420 }}
              />
            ) : null}
          </Space>

          <DataTableActions
            rows={sortedRows}
            columns={visibleColumns}
            fileName={resolvedFileName}
            fullscreenTitle={resolvedFullscreenTitle}
            tableProps={tableProps}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
            filterDisabled={serverPagination || !rows.length}
            onExport={handleRemoteExport}
            exportDisabled={loading || (exportData ? !searched : !rows.length)}
          />
        </div>
      </Form>

      {searched && rows.length ? (
        <div className="billing-table-statebar">
          <Text type="secondary">
            {activeFilterCount ? `${activeFilterCount} filter kolom aktif` : "Semua data tampil"}
            {sortState?.column ? ` - sort ${sortState.column} ${sortState.direction === "descend" ? "DESC" : "ASC"}` : ""}
          </Text>

          {hiddenColumnKeys.length ? (
            <Space wrap size={6}>
              <Text type="secondary">Kolom disembunyikan:</Text>
              {hiddenColumnKeys.map((column) => {
                const label = columnOptions.find((option) => option.value === column)?.label || column;

                return (
                  <Button
                    key={column}
                    size="small"
                    onClick={() =>
                      setVisibleColumnKeys((currentColumns) => {
                        const currentVisibleColumns = currentColumns === undefined
                          ? dynamicColumnKeys
                          : normalizeArrayFilter(currentColumns);

                        return dynamicColumnKeys.filter(
                          (visibleColumn) =>
                            currentVisibleColumns.includes(visibleColumn) || visibleColumn === column,
                        );
                      })
                    }
                  >
                    {label}
                  </Button>
                );
              })}
              <Button size="small" type="link" onClick={() => setVisibleColumnKeys(undefined)}>
                Restore semua
              </Button>
            </Space>
          ) : null}
        </div>
      ) : null}

      <div className="billing-table-loading-wrap" aria-busy={loading}>
        {loading ? (
          <div className="billing-table-loading-overlay">
            {tableLoadingIndicator}
          </div>
        ) : null}
        <Table
          {...tableProps}
          style={{ minHeight: 340 }}
          locale={{
            emptyText: searched ? (
              <div style={emptyStateStyle}>
                <Empty
                  image={normalEmptyImage}
                  description={
                    <Text strong style={{ color: "#15803d", fontSize: 15 }}>
                      {resolvedSearchedEmptyDescription}
                    </Text>
                  }
                />
              </div>
            ) : (
              <div style={emptyStateStyle}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text style={{ color: "#64748b" }}>
                      {resolvedEmptyDescription}
                    </Text>
                  }
                />
              </div>
            ),
          }}
        />
      </div>
    </Card>
  );
}
