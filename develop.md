# Destiny Atlas 开发说明

## 产品目标与 MVP 边界

Destiny Atlas 是纯静态、本地优先的文化与自我探索应用。MVP 完成“明确输入 → 确定性计算 → 规则解释 → 24 月报告 → 打印/JSON 导出”闭环。核心功能不依赖后端、AI 或 API Key。

已启用：历史 IANA 时区转换、可选真太阳时近似、生命灵数、确定性塔罗、八字四柱、十颗天体黄经与本命主要相位、MBTI 描述、24 月规则时间轴、综合建议、打印与 JSON、CLI。

明确降级：离线地点清单而非全球地理编码；未验证的宫位/上升/MC、大运、格局旺衰、喜用神不输出；行运仅在每月 1 日采样木星/土星与本命太阳，不宣称精确过境时刻；PDF 由浏览器打印生成。

## 架构

- `src/engines/`：无 React 依赖的计算与报告引擎
- `src/data/`：可审计的离线地点数据
- `src/components/`：可视化
- `src/types/`：统一公共结构
- `cli/`：复用 `generateDestinyReport`
- `tests/`：引擎和 UI 流程测试
- `docs/skill/`：Agent/CLI 契约

## 依赖选择与许可证

运行时只使用 MIT 依赖：React、Zod、Luxon、lunar-javascript、astronomy-engine。未采用有 AGPL/商业双重许可约束的 Swiss Ephemeris。`npm run licenses` 会检查生产依赖许可证；完整结果以实际命令输出为准。

## 算法风险

历法流派、子时换日、真太阳时和塔罗缩减存在不同约定；均在算法文档明确。Intl/IANA 数据随运行环境更新。天文库给出天体坐标不等于已实现占星宫位。多体系重合不代表预测准确性提高。

## 开发与验收

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
npm run licenses
```

验收关注：公开样例生命路径 8 与 2026/27/28 年度牌；跨时区和 DST 不存在时刻；24 条时间线；十颗天体；四柱；UI 生成流程；静态构建。部署由 `.github/workflows/deploy.yml` 在 `main` 推送后执行同样门禁。

## 后续路线

1. 接入可离线打包、可审计的全球城市数据与时区边界。
2. 用权威样例扩展节气、立春、子时与真太阳时金丝雀测试。
3. 实现并验证精确过境搜索、Whole Sign 宫位与上升点。
4. 在用户明确提供规则所需信息后实现大运。
5. 增加 Playwright 多视口与打印快照测试。
