import Link from "next/link";
import { GeoZipperDemo } from "@/components/geo-zipper-demo";

export default function Home() {
  return <main className="marketing"><header><Link href="/" className="brand">云启智联</Link><nav><a href="#features">产品能力</a><a href="#evidence">原始证据</a><a href="#contact">联系我们</a></nav><div><Link href="/login" className="dark-button">数据账号登录</Link></div></header><section className="hero"><div><span className="announcement">GEO 原始证据分析系统</span><h1>让每一次 AI 问答<br />成为品牌可见性的证据</h1><p>云启智联持续整理豆包、DeepSeek、元宝、Kimi、千问等平台的真实回答。客户不只看到指标，更能逐条查看提问、回答与品牌提及。</p><div className="hero-actions"><Link href="/login" className="dark-button large">登录查看数据 <b>→</b></Link></div><p className="trust">以完整原始问答为准，不用黑盒评分替代证据</p></div><GeoZipperDemo /></section><section id="features" className="marketing-section"><p className="eyebrow">证据，而非猜测</p><h2>为客户交付真正可复查的 GEO 结果</h2><div className="feature-grid"><article><span>01</span><h3>原始问答全保留</h3><p>问题、平台、原始回答、采集时间及品牌提及顺序完整归档。</p></article><article><span>02</span><h3>筛选快速定位</h3><p>按复查记录、平台、提及客户、排名和优势判断定位所需证据。</p></article><article><span>03</span><h3>登录后查看</h3><p>数据账号登录后才可浏览完整原始回答与人工复查判断。</p></article></div></section></main>;
}
