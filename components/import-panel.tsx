"use client";
import { useState } from "react";

type Preview = { validCount: number; invalidCount: number; invalidRows: { row: number; errors: string[] }[] };

export function ImportPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  async function inspect() {
    if (!file) return;
    setError("");
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/operations/projects/demo-project/batches/import", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "文件无法解析"); return; }
    setPreview(data);
  }
  return <section className="import-card"><div className="drop-zone"><span>↑</span><h3>上传采集 Excel</h3><p>仅支持 .xlsx，系统将读取 Sheet1 并验证 22 个字段。</p><label><input type="file" accept=".xlsx" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />选择文件</label>{file && <b className="file-name">已选择：{file.name}</b>}</div><button className="dark-button" onClick={inspect} disabled={!file}>校验并预览</button>{error && <p className="error">{error}</p>}{preview && <div className="preview"><div><b>{preview.validCount}</b><span>可导入记录</span></div><div><b>{preview.invalidCount}</b><span>需修复记录</span></div>{preview.invalidRows.slice(0, 3).map((row) => <p key={row.row}>第 {row.row} 行：{row.errors.join("；")}</p>)}</div>}</section>;
}
