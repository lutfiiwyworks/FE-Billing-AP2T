import api from "../../../shared/services/api";

const getDownloadFileName = (contentDisposition, fallbackName) => {
  const fileNameMatch = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);

  if (!fileNameMatch?.[1]) return fallbackName;

  return decodeURIComponent(fileNameMatch[1]);
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getCekAnomaliHariBaca = async (params) => {
  const response = await api.get("/api/detil-anomali-haribaca-ap2t", {
    params: {
      limit: 100,
      page: 1,
      ...params,
    },
  });

  return response.data;
};

export const exportCekAnomaliHariBaca = async (params) => {
  const response = await api.get("/api/detil-anomali-haribaca-ap2t/export", {
    params,
    responseType: "blob",
  });
  const timestamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
  const fileName = getDownloadFileName(
    response.headers?.["content-disposition"],
    `pengecekan-anomali-hari-baca-${timestamp}.xlsx`,
  );

  downloadBlob(response.data, fileName);
};
