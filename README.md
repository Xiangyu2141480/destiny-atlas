# Destiny Atlas · 命运图谱

> Explore Your Patterns. Navigate Your Future.

一个静态、本地优先、可追溯的多体系文化探索工具。输入出生日期、当地时间、明确城市和自选 MBTI 后，应用会在浏览器内生成八字基础盘、真实天体黄经、确定性塔罗/灵数、24 月时间轴与规则型综合报告。

## 功能

- 默认精简版：个人标签、起始月重点、三条行动和当年提醒；可随时切换详细版
- IANA 历史时区、DST、UTC 转换与可选真太阳时近似
- 节气四柱、藏干、纳音、生肖和显式五行计数
- 日月与八大行星的地心视黄经、热带星座和主要本命相位
- 生命路径、个人年/月、确定性本命牌与年度牌
- 16 种用户自选 MBTI 的审慎描述
- 未来 24 个月交互时间轴及分领域现实行动提示
- 计算链路、来源、降级和局限展示
- 浏览器打印/另存 PDF、结构化 JSON、复用同一引擎的 CLI

当前截图请在本地运行后生成；仓库不放置未经实际浏览器采集的占位图。

## 技术栈

React 19、TypeScript、Vite、Zod、Luxon、lunar-javascript、Astronomy Engine、Vitest、Testing Library。没有后端和 AI 依赖。

## 快速开始

```bash
git clone <your-fork-url>
cd destiny-atlas
npm install
npm run dev
```

要求 Node.js 20+。打开 Vite 输出的本地 URL。公开测试样例已预填：`2002-10-03 02:00 / 广州 / ENFJ`。

## 开发与测试

```bash
npm run lint
npm run test
npm run build
npm run licenses
npm run cli -- docs/skill/examples/input.json report.json
```

代码结构与开发计划见 [develop.md](develop.md) 和 [docs/architecture.md](docs/architecture.md)。计算 UI 完全复用 `src/engines/report.ts`；CLI 不包含第二套算法。

## 计算方法

天文数据由 Astronomy Engine 计算，八字基础盘由 lunar-javascript 按节气规则计算，时区由 Luxon/平台 IANA 数据处理。生命灵数与塔罗数字学采用仓库明确、可测试的缩减规则。完整公式、容许度和周期边界见 [算法文档](docs/algorithms.md)。

未完成独立验证的功能会降级：不输出宫位/上升/MC，不判断八字旺衰、格局、喜用神或大运；行运为每月 1 日采样，不冒充精确过境搜索。见 [局限](docs/limitations.md)。

## GitHub Pages 部署

1. Fork 仓库，在 Settings → Pages 将 Source 设为 **GitHub Actions**。
2. 推送到 `main`；工作流先执行 `npm ci`、lint、test、license check 和 build。
3. 工作流把 `VITE_BASE_PATH` 设置为 `/<repo>/`，因此项目页不要求根路径。

也可在任意静态平台发布 `npm run build` 生成的 `dist/`。自定义根路径时设置 `VITE_BASE_PATH`。

## 文档

- [开发说明](develop.md)
- [算法约定](docs/algorithms.md)
- [架构](docs/architecture.md)
- [隐私](docs/privacy.md)
- [局限](docs/limitations.md)
- [来源与许可](docs/references.md)
- [CLI / Skill](docs/skill/SKILL.md)
- [English README](README_EN.md)

## 路线图与贡献

路线图包括全球离线地点、更多权威边界样例、精确行运搜索、经验证的 Whole Sign 宫位和端到端打印回归。提交变更前请运行全部四项质量门禁；新算法必须注明来源、约定、输入、中间值和局限，不接受随机“准确率”或未经核验的黄金值。

## 许可证与免责声明

项目代码采用 [MIT License](LICENSE)。生产依赖均为 MIT，锁定版本见 `package-lock.json`；可运行 `npm run licenses` 复核。

本项目用于文化、娱乐和自我探索，不声称科学预测命运，不构成医疗、心理、法律、财务或其他专业建议。个人数据默认只在本地处理，详见 [隐私说明](docs/privacy.md)。

## 0.2：大白话解读、年度视图与可选联网

报告增加六项基础解读、五个生活领域的解释/行动/提醒，并可在 24 个月和 5 个自然年之间切换。年度从起始月所在年份开始，每年完整覆盖 1—12 月，按季度给出小行动。它们来自明确的本地规则，不是 AI 随机生成或具体事件预报。

“联网查找更多城市”使用 Open-Meteo / GeoNames。只有用户点击联网搜索后才发送城市关键词；不会发送姓名、出生日期、出生时间、MBTI 或报告。核对地区并选择后，才将坐标和 IANA 时区填入可编辑的自定义地点。断网时可继续使用原有 82 个离线地点或手填坐标。报告也提供官方方法资料与通用资料搜索入口。

**服务与数据边界**：Open-Meteo 地理编码项目目前公开条款面向开源开发者和非商业使用，数据声明为 CC BY-NC 4.0。界面与导出保留来源/许可信息；代码仍采用 MIT，没有引入或打包该服务的 AGPL 实现。商业部署应先确认服务授权，或替换地点查询适配器。服务条款及可用性以提供方为准：[公开说明](https://github.com/open-meteo/geocoding-api#terms--privacy)。

报告 Schema 更新为 `1.1`：保留旧字段，新增 `explanation`、`yearlyTimeline` 与月度 `reading`。CLI 调用同一引擎，仍不联网。传入 `generateDestinyReport(input, now)` 时，默认月份与年份都使用该时间，便于重现。输入/输出契约见 `docs/skill/`。

## 0.3：精简版与详细版

首次使用默认进入精简版，生成报告前和阅读时都能选择版本。精简版展示起始月和当年的重点；详细版保留四柱、星盘、塔罗、人格图鉴、24 个月、5 年与计算依据。

两种版本复用同一个报告对象，切换不重新计算、不清空出生信息。关注领域双向同步；切回详细版会保留已选年份、月份和图鉴。首次阅读精简版不会渲染星盘或人格图片。打印只包含当前版本，完整 JSON 导出始终包含全部数据。

- 精简入口：`https://xiangyu2141480.github.io/destiny-atlas/?view=summary`
- 详细入口：`https://xiangyu2141480.github.io/destiny-atlas/?view=detailed`

链接仅记录阅读模式，不包含出生信息。手机增加直接跳到填写区的入口、始终可达的版本切换与保存工具，并缩短详细版目录。此版本不修改算法、报告 Schema 1.1 或离线/联网地点计算规则。
