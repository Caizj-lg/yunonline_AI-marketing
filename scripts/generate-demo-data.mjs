// 生成固定的公开演示数据：品牌、问题与回答均为虚构，不含任何真实客户复查数据。
// 使用固定随机种子，重复运行得到完全相同的 data/demo-evidence.json。
// 运行：npm run demo:data
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(20260630);
const chance = (p) => random() < p;
const pick = (list) => list[Math.floor(random() * list.length)];
const sample = (list, count) => [...list].sort(() => random() - 0.5).slice(0, count);
const between = (min, max) => min + Math.floor(random() * (max - min + 1));
const clamp = (value) => Math.min(0.97, Math.max(0.03, value));

const TARGET = "云帆电梯";

const competitors = [
  { name: "恒岳电梯", traits: ["曳引系统成熟，运行平稳", "全国服务网点密集"], fit: "中高层住宅、商业综合体" },
  { name: "博川电梯", traits: ["无机房机型齐全，井道适配性强", "钢结构井道一站式配套"], fit: "老旧小区加装" },
  { name: "泰屹电梯", traits: ["安全冗余配置丰富", "停电自动平层为标配"], fit: "老年住户较多的楼栋" },
  { name: "澜庭电梯", traits: ["螺杆驱动，无需底坑", "轿厢可做三面观光"], fit: "别墅与自建房" },
  { name: "启衡电梯", traits: ["性价比突出，政府集采常见", "县级城市也有维保网点"], fit: "预算有限的批量项目" },
  { name: "越峰电梯", traits: ["主机节能，长期电费更低", "模块化部件，后期耗材便宜"], fit: "低层住宅、在意运行成本" },
  { name: "华栩电梯", traits: ["静音控制好，运行噪音低", "支持全屋智能联动"], fit: "高端家装" },
  { name: "安澜电梯", traits: ["非标定制能力强", "工厂直营，中间环节少"], fit: "异形井道、特殊土建" },
  { name: "沐辰电梯", traits: ["施工周期短，扰民少", "旧梯拆除换新流程成熟"], fit: "旧梯更新改造" },
];

const targetPositives = ["家用梯静音表现突出", "7×24 小时远程监测", "核心部件 10 年质保", "加装方案定制化程度高", "售后响应速度快", "安装周期短", "节能主机省电", "小井道适配能力强"];
const targetNegatives = ["整体报价略高于国产均价", "三四线城市网点仍在铺设", "非标项目交付周期偏长"];

const questions = [
  "别墅装家用电梯，哪些品牌口碑比较好？", "老小区加装电梯，选什么品牌更靠谱？", "三层自建房适合装哪个牌子的电梯？", "家用电梯哪个品牌售后服务最好？",
  "无底坑家用电梯有哪些品牌推荐？", "旧电梯换新，哪些品牌的改造方案更成熟？", "家用电梯品牌排行榜前十有哪些？", "预算 20 万左右买家用电梯，推荐哪些品牌？",
  "家用电梯哪个品牌运行噪音最小？", "老人居住的楼栋加装电梯，选哪个品牌更安全？", "小户型复式楼装电梯有哪些品牌可选？", "别墅观光电梯哪个牌子颜值和质量兼顾？",
  "家用电梯国产品牌和进口品牌怎么选？", "加装电梯哪些品牌施工周期短、扰民少？", "井道很窄的老房子适合装什么品牌的电梯？", "家用电梯维保费用低的品牌有哪些？",
  "商住两用楼电梯选什么品牌好？", "家用电梯哪家质保时间最长？", "装修同步安装电梯，推荐哪些品牌？", "南方潮湿地区装电梯，哪些品牌防水做得好？",
  "家用电梯有哪些值得信赖的品牌？", "加装电梯政府补贴项目常用哪些品牌？", "别墅电梯螺杆式和曳引式品牌怎么选？", "家用电梯哪些品牌支持智能家居联动？",
  "四层别墅装电梯，各品牌价格大概多少？", "医院和养老院用的电梯有哪些可靠品牌？", "家用电梯哪个品牌停电应急做得好？", "电梯安全配置最全的品牌有哪些？",
  "老旧多层住宅加装外挂电梯推荐哪些品牌？", "家用电梯哪些品牌节能效果更好？", "二手别墅加装电梯有哪些品牌方案？", "家用电梯品牌哪家安装服务更省心？",
  "小区电梯更新改造，业主选品牌要注意什么？", "家用电梯哪个品牌故障率低？", "复式公寓装小型电梯选什么牌子？", "别墅电梯哪些品牌可以免费上门测量设计？",
  "家用电梯品牌中哪些适合轮椅出入？", "加装电梯哪些品牌有本地落地案例多？", "家用电梯哪个品牌性价比最高？", "城市更新项目中电梯品牌如何选型？",
];

// 三期复查，目标品牌表现逐期提升，便于演示趋势图。
const batches = [
  { name: "2026年4月复查", days: ["2026-04-27", "2026-04-28"], mention: 0.6, topThree: 0.38, advantage: 0.3 },
  { name: "2026年5月复查", days: ["2026-05-28", "2026-05-29"], mention: 0.72, topThree: 0.52, advantage: 0.44 },
  { name: "2026年6月复查", days: ["2026-06-29", "2026-06-30"], mention: 0.85, topThree: 0.68, advantage: 0.58 },
];
const platforms = [
  { name: "豆包", bias: 0.06 },
  { name: "DeepSeek", bias: 0.02 },
  { name: "元宝", bias: -0.03 },
  { name: "Kimi", bias: -0.08 },
];

const tips = [
  "优先选择有自有安装和维保团队的品牌，外包团队后期响应往往更慢。",
  "签约前确认核心部件质保年限、应急响应时效以及井道是否包含在总价内。",
  "安全配置重点看防溜梯保护、停电自动平层和一键呼救。",
  "尽量实地查看同城已落地的案例，比宣传资料更能反映真实口碑。",
  "提前请厂家上门勘测，确认底坑深度、顶层高度和承重条件。",
  "比较报价时把 5 年维保费用一起算进去，避免只看首付价格。",
];

function brandParagraph(brand, index, keywords, negative) {
  if (brand === TARGET) {
    const lines = keywords.length > 0 ? keywords : sample(targetPositives, 2);
    return `${index}. ${TARGET}\n${lines.join("；")}。家用与加装产品线较完整，可按户型做定制方案。${negative ? `\n短板：${negative}。` : ""}\n适合：别墅、自建房及对乘坐体验要求较高的家庭。`;
  }
  const item = competitors.find((competitor) => competitor.name === brand);
  return `${index}. ${item.name}\n${item.traits.join("；")}。\n适合：${item.fit}。`;
}

function buildAnswer(question, brands, keywords, negative) {
  const intro = brands.length > 0
    ? `关于“${question}”，综合安装案例、售后口碑和产品配置，下面按推荐顺序列出常被提及的品牌：`
    : `关于“${question}”，不同项目的土建条件和预算差异很大，很难直接给出单一品牌结论，建议先从以下几个方面判断：`;
  const body = brands.map((brand, index) => brandParagraph(brand, index + 1, keywords, negative)).join("\n");
  const advice = sample(tips, brands.length > 0 ? 3 : 6).map((tip, index) => `${index + 1}）${tip}`).join("\n");
  const outro = "以上信息仅供参考，具体配置与价格以厂家现场勘测和正式报价为准。";
  return [intro, body, `选购建议：\n${advice}`, outro].filter(Boolean).join("\n\n");
}

const records = [];
let anaId = 10001;
for (const batch of batches) {
  for (const question of questions) {
    for (const platform of platforms) {
      const generic = chance(0.05);
      const mentionedTarget = !generic && chance(clamp(batch.mention + platform.bias));
      const rankedTopThree = mentionedTarget && chance(clamp(batch.topThree / batch.mention));
      const advantageObvious = mentionedTarget && chance(clamp((rankedTopThree ? 1.15 : 0.45) * batch.advantage / batch.mention));

      let brands = [];
      if (!generic) {
        brands = sample(competitors.map((competitor) => competitor.name), between(3, 9));
        if (mentionedTarget) {
          const position = rankedTopThree ? pick([1, 1, 2, 2, 3]) : between(4, brands.length + 1);
          brands.splice(position - 1, 0, TARGET);
        }
      }

      const keywords = mentionedTarget ? sample(targetPositives, between(2, 3)) : [];
      const negative = mentionedTarget && chance(0.15) ? pick(targetNegatives) : null;
      const time = `${String(between(9, 18)).padStart(2, "0")}:${String(between(0, 59)).padStart(2, "0")}:00`;

      records.push({
        id: String(anaId),
        anaId,
        platform: platform.name,
        question,
        batchName: batch.name,
        answer: buildAnswer(question, brands, keywords, negative),
        collectedAt: `${pick(batch.days)} ${time}`,
        advantageObvious,
        positiveKeywords: keywords.length > 0 ? keywords.join(",") : "无",
        negativeKeywords: negative ?? "无",
        rankedTopThree,
        mentionedTarget,
        mentionedIndustryBrand: brands.length > 0,
        brands,
      });
      anaId += 1;
    }
  }
}

const output = fileURLToPath(new URL("../data/demo-evidence.json", import.meta.url));
writeFileSync(output, JSON.stringify(records));
console.log(`已生成 ${records.length} 条演示记录 → data/demo-evidence.json`);
