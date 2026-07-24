import * as XLSX from "xlsx";
import { validateRows } from "./import-validation";

export async function parseWorkbook(filePath: string) {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets.Sheet1;
  if (!sheet) throw new Error("未找到 Sheet1 工作表");
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
  return validateRows(rows);
}

export function parseWorkbookBuffer(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet = workbook.Sheets.Sheet1;
  if (!sheet) throw new Error("未找到 Sheet1 工作表");
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
  return validateRows(rows);
}
