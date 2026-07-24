import records from "@/data/demo-evidence.json";

export type DemoEvidence = (typeof records)[number];
export const demoEvidence: DemoEvidence[] = records;
export const platformColors: Record<string, string> = { 豆包: "#ec6d4e", 元宝: "#4c82ee", Kimi: "#8f67df", DeepSeek: "#2367d1", 千问: "#2da67b" };
