# Destiny Atlas Codex 交接提示词

本文档用于把 Destiny Atlas 项目完整交接给 Codex。建议先发送“主提示词”，再根据实际任务追加后面的专项提示词。

## 项目地址

- GitHub 仓库：`https://github.com/Xiangyu2141480/destiny-atlas`
- 在线网站：`https://xiangyu2141480.github.io/destiny-atlas/`
- 默认分支：`main`
- 当前交接基线：远程 `main` 最新提交
- 本地目录：在 Codex 中打开 `destiny-atlas` 仓库根目录。根目录必须同时包含 `package.json`、`src/`、`tests/`、`docs/` 和 `.github/`。

如果 Codex 无法访问当前本地目录，使用：

```bash
git clone https://github.com/Xiangyu2141480/destiny-atlas.git
cd destiny-atlas
pwd
npm ci
```

不要依赖其他 AI 会话中的临时绝对路径。开始工作前必须执行 `pwd`、`git status -sb` 和 `git remote -v`，确认正在操作上述仓库。

## 主提示词

将以下内容完整复制给 Codex：

```text
你正在维护一个已经上线的 React + TypeScript 开源项目 Destiny Atlas（命运图谱）。

仓库：
https://github.com/Xiangyu2141480/destiny-atlas

线上地址：
https://xiangyu2141480.github.io/destiny-atlas/

请在当前打开的 destiny-atlas 仓库根目录工作。开始前执行：

pwd
git status -sb
git remote -v
node --version
npm --version

根目录必须包含：

package.json
src/
tests/
docs/
.github/

如果当前目录不符合这些条件，停止修改并明确报告，不要在其他目录创建同名项目。

项目定位：

Destiny Atlas 是一个静态优先、本地计算、可追溯的文化娱乐与自我探索 Web 应用。用户输入出生日期、当地出生时间、出生地点和自选 MBTI 后，应用在浏览器内生成八字基础排盘、真实天体黄经、确定性塔罗数字学、生命灵数、人格描述和未来 24 个月时间轴。

核心原则：

1. 计算结果必须来自确定性程序，不允许随机生成。
2. 不允许让大模型代替天文、历法、干支、塔罗编号或灵数计算。
3. 不声称科学预测命运，不输出虚假概率或确定性现实事件。
4. 计算与解释必须分离。
5. 保留输入、中间结果、计算约定、数据来源和局限。
6. 用户出生数据默认只在本地浏览器处理。
7. 核心功能不能依赖后端或 AI API Key。
8. 不得为视觉升级破坏输入、时区、计算、报告、打印或 JSON 导出。

当前技术栈：

- React 19
- TypeScript 5.9
- Vite 7
- Zod
- Luxon
- lunar-javascript
- Astronomy Engine
- Vitest
- React Testing Library
- ESLint
- GitHub Actions / GitHub Pages

当前没有 Tailwind、GSAP、Motion、Three.js 或后端服务。不要默认引入大型依赖。新增依赖前必须说明必要性、包体影响、许可证和无依赖替代方案。

当前产品能力：

- 82 个离线地点
- 覆盖全部中国大陆省会、自治区首府、直辖市及常见地级市
- 必须保留福建宁德和江苏苏州
- 支持中文、英文、省份和时区搜索
- 搜索无结果时可进入自定义城市模式
- 自定义城市必须提供名称、经纬度和有效 IANA 时区
- 中国大陆内部统一使用 IANA `Asia/Shanghai`，界面显示“中国标准时间 UTC+8”
- 支持历史时区、DST、UTC 转换和可选真太阳时近似
- 支持四柱、藏干、纳音、生肖和五行显式计数
- 支持十颗天体黄经、热带星座和主要相位
- 支持生命路径、个人年/月、本命塔罗和年度塔罗
- 支持全部 16 种 MBTI
- 支持未来 24 个月趋势时间轴
- 支持打印/另存 PDF 和 JSON 导出
- 支持 CLI 与 Skill Schema

当前视觉方向：

Arcane Observatory，中文为“玄秘天文观测馆”。风格结合古典塔罗、文艺复兴天文学、铜版雕刻、黄道、月相、炼金术和现代数字交互。配色以宇宙黑、象牙白、古铜金、紫晶色为主。

当前已有视觉能力：

- 多层 SVG 天体仪
- 星场、极光、星轨、流星和符文
- 鼠标指针视差
- 仪式化出生信息表单
- 自定义暗色城市选择器
- 3D 塔罗翻牌
- 可交互 SVG 星盘
- 报告滚动揭示
- 16 张原创 MBTI 拟人星象插画
- 四色人格分组：NT 紫色、NF 绿色、SJ 蓝色、SP 黄色
- 人格大图预览、16 张缩略卡切换、NATAL 本命标记
- 页面内“暂停动态 / 开启动态”控制
- prefers-reduced-motion 降级
- 移动端动态效果降级

版权约束：

- 不得复制、下载或打包 16Personalities 官方人物插画。
- `public/assets/mbti/` 中的 16 张 WebP 是本项目原创 AI 生成资产。
- 不得替换为来源不明的 Pinterest、商业塔罗牌或现代受版权保护素材。
- 新增素材必须在 `ASSET_CREDITS.md` 记录来源、授权、修改情况和用途。
- 项目采用 MIT License，生产依赖许可证必须兼容。

第一步：阅读现状

请完整阅读：

README.md
README_EN.md
develop.md
visual-redesign.md
ASSET_CREDITS.md
docs/architecture.md
docs/algorithms.md
docs/limitations.md
docs/privacy.md
docs/references.md
package.json
vite.config.ts
.github/workflows/deploy.yml

然后重点检查：

src/App.tsx
src/styles.css
src/types/index.ts
src/data/places.ts
src/components/ArcaneSelect.tsx
src/components/CelestialInstrument.tsx
src/components/NatalChart.tsx
src/components/PersonalityCards.tsx
src/engines/report.ts
src/engines/datetime.ts
src/engines/bazi/index.ts
src/engines/astrology/index.ts
src/engines/tarot/index.ts
src/engines/numerology/index.ts
src/engines/personality/index.ts
tests/app.test.tsx
tests/engines.test.ts
tests/places.test.ts

第二步：建立基线

在修改前运行：

npm ci
npm run lint
npm run test
npm run licenses
npm run build

记录原有失败、警告和产物大小。不要把原有问题误认为本次修改引入的问题。

第三步：分析后再修改

先用浏览器分别检查：

- 1440 × 900
- 1280 × 800
- 768 × 1024
- 390 × 844
- 375 × 812

至少走通：

1. 搜索并选择福建宁德。
2. 搜索并选择江苏苏州。
3. 输入一个未收录城市，进入自定义城市模式。
4. 填写有效 IANA 时区和经纬度并生成报告。
5. 切换 MBTI。
6. 生成完整报告。
7. 点击星盘行星。
8. 翻转塔罗牌。
9. 切换 16 人格插画预览。
10. 暂停并恢复持续动画。
11. 切换 24 个月时间轴。
12. 测试 JSON 导出和打印入口。

先列出实际发现的问题、对应 DOM/组件和修改方案，再开始编辑。不要仅凭代码猜测视觉效果。

第四步：实施原则

- 优先修复可读性、层级、响应式、交互反馈和性能问题。
- 保持高级、克制、神秘的视觉方向。
- 不要堆叠多个重型 Canvas 或 WebGL 背景。
- 大部分动画使用 transform 和 opacity。
- 所有持续动画必须可暂停。
- Reduced Motion 下不得播放持续动画或长转场。
- 动画失败时页面内容必须仍然可读和可操作。
- 图片应使用 WebP、合理尺寸、lazy loading 和 async decoding。
- 不要把全部业务逻辑继续堆入 `App.tsx`；新增复杂功能时拆分组件。
- 保持键盘导航、焦点样式、ARIA 标签和颜色对比度。
- 不要把移动端简单缩小桌面布局。

计算模块的禁止事项：

- 不要把五行数量解释为旺衰、格局或喜用神。
- 不要编造大运、起运年龄或十神关系。
- 不要把天体位置等同于完整宫位系统。
- 不要输出未验证的上升点、MC、宫位或宫主星。
- 不要把每月采样描述成精确过境时刻。
- 不要给确定性塔罗随机正逆位。
- 不要从 MBTI 推断智力、收入、疾病或成功概率。
- 不要把多体系主题重合解释为准确率提升。

城市与时区约束：

- 福建宁德必须保留：
  id `ningde`
  名称 `宁德 / Ningde`
  地区 `中国·福建`
  纬度 `26.6656`
  经度 `119.5477`
  时区 `Asia/Shanghai`

- 江苏苏州必须保留：
  id `suzhou-js`
  名称 `苏州 / Suzhou`
  地区 `中国·江苏`
  纬度 `31.2989`
  经度 `120.5853`
  时区 `Asia/Shanghai`

- 不要为中国城市创建不存在的 IANA 城市时区。
- 中国大陆城市内部使用 `Asia/Shanghai` 是正确行为，界面应显示“中国标准时间 UTC+8”避免误解。
- 自定义城市不能只输入名称后猜测经纬度；若没有可信地理编码来源，必须要求用户补充经纬度和 IANA 时区。

核心文件职责：

- `src/App.tsx`
  页面状态、输入流程、报告布局和顶层交互。继续拆分，避免无限膨胀。

- `src/types/index.ts`
  公共 TypeScript 数据结构。修改输入输出前先更新这里。

- `src/data/places.ts`
  离线地点、经纬度和 IANA 时区。城市 ID 必须唯一。

- `src/components/ArcaneSelect.tsx`
  支持搜索、键盘导航和无匹配城市转自定义模式的下拉组件。

- `src/components/CelestialInstrument.tsx`
  Hero 多层 SVG 天体仪。属于视觉层，不承载真实星盘计算。

- `src/components/NatalChart.tsx`
  根据真实计算结果绘制本命天体与相位。

- `src/components/PersonalityCards.tsx`
  16 人格原创插画、几何符印、大图预览和本命标记。

- `public/assets/mbti/`
  16 张原创 WebP 人格插画。文件名为小写 MBTI 类型。

- `src/engines/datetime.ts`
  当地时间、IANA 时区、DST、UTC 和真太阳时近似。

- `src/engines/bazi/`
  四柱、藏干、纳音、生肖和五行原始计数。

- `src/engines/astrology/`
  天体黄经、星座、主要相位和月度行运采样。

- `src/engines/tarot/`
  确定性本命牌、灵魂牌和年度牌。

- `src/engines/numerology/`
  生命路径、生日数、个人年和个人月。

- `src/engines/personality/`
  用户自选 MBTI 的审慎描述。

- `src/engines/report.ts`
  输入校验、各引擎编排、24 个月时间轴和最终 JSON 报告。

- `tests/`
  计算、地点、表单和完整报告测试。不得删除测试来掩盖失败。

- `.github/workflows/deploy.yml`
  GitHub Pages 自动部署，使用 Node.js 24，并注入 Vite 仓库子路径。

优先优化方向：

1. 将 `App.tsx` 中较大的表单和报告章节拆分为独立组件，但保持数据流清晰。
2. 对天文和历法依赖做合理代码分包，降低当前约 788 KB 的主 JavaScript 包。
3. 增加 Playwright 端到端测试和截图回归。
4. 完善移动端报告章节导航和人格画廊滑动提示。
5. 增加图片加载占位、失败回退和预加载当前人格图片。
6. 加强打印分页，避免大型图表或人格卡被截断。
7. 提升城市搜索的键盘体验和结果计数提示。
8. 检查色彩对比度、焦点顺序和屏幕阅读器语义。
9. 只在有可信算法和黄金测试时扩展复杂命理功能。

完成要求：

- 实际修改代码，不只给建议。
- 修改范围要小而清晰。
- 每项修改说明原因、涉及文件和用户影响。
- 新逻辑必须补充测试。
- 最终运行：

npm run lint
npm run test
npm run licenses
npm run build

- 使用真实浏览器完成桌面和移动端验证。
- 报告任何仍存在的限制或警告。
- 检查 `git diff`，不要提交调试文件、缓存、密钥或无关截图。
- 未得到明确授权前，不要 force push、重写历史或删除用户内容。
- 如果需要发布，提交到独立分支并创建 PR；不要直接覆盖 `main`，除非我明确要求。
```

## 界面专项提示词

```text
基于 CODEX_HANDOFF_PROMPTS.md 和当前代码，对 Destiny Atlas 做一轮界面质量优化。

先在真实浏览器中检查桌面和移动端，不要只看代码。重点检查首屏视觉层级、表单密度、城市搜索浮层、错误反馈、报告导航、塔罗翻转、星盘选择、人格插画画廊、24 个月时间轴和打印页面。

只修复有实际证据的问题。保持 Arcane Observatory 艺术方向，不要改造成通用 SaaS 模板，不要堆叠无意义粒子或引入重型 3D 库。

所有持续动画必须支持页面内暂停和 prefers-reduced-motion。主要交互反馈控制在 150–400ms。移动端不得水平溢出，输入框、下拉菜单和按钮不得被装饰元素遮挡。

保持全部计算、导出和测试行为不变。完成后运行 lint、test、licenses、build，并提供桌面与移动端截图证据。
```

## 性能专项提示词

```text
分析 Destiny Atlas 的生产构建体积和运行时性能，并直接实施低风险优化。

当前主 JavaScript 包约 788 KB。优先分析 astronomy-engine、lunar-javascript、报告模块和页面组件的依赖关系。采用动态 import、模块边界、按需加载或 manualChunks 时，必须保证：

- 首屏表单立即可用。
- 用户点击生成报告后才加载重型计算模块是允许的。
- CLI 仍能调用同一套引擎。
- GitHub Pages 的 VITE_BASE_PATH 正常。
- 不复制计算逻辑。
- 不改变报告 JSON Schema。

同时检查 16 张 WebP 图片的懒加载、解码、缓存和布局占位，避免 CLS。

给出优化前后构建产物大小，运行 lint、test、licenses、build，并在浏览器验证首屏和报告生成。
```

## 测试专项提示词

```text
为 Destiny Atlas 增强自动化测试，禁止删除或弱化现有断言。

重点增加：

- 宁德和苏州搜索、选择及地区显示。
- 搜索无结果后创建自定义城市。
- 自定义经纬度边界。
- 无效 IANA 时区。
- DST 不存在时间。
- 城市 ID 唯一性。
- 16 人格图片路径和预览切换。
- 本命人格 NATAL 标记不随预览变化。
- 暂停/恢复动态。
- JSON 导出。
- 24 个月时间轴切换。
- Reduced Motion。
- 390px 和 375px 移动端无水平溢出。

如引入 Playwright，保持测试可在 GitHub Actions 非交互运行。最终说明新增测试覆盖了什么、哪些视觉问题仍需人工检查。
```

## 计算审计提示词

```text
对 Destiny Atlas 的计算链路进行证据驱动审计，不要先重构。

沿以下调用链检查：

BirthInput
→ birthInputSchema
→ getPlace 或 customPlace
→ calculateTime
→ calculateBazi / calculateAstrology / calculateNumerology / birthCards
→ createTimeline
→ generateDestinyReport
→ UI / JSON / CLI

逐项核对输入、时区、UTC、历史 DST、真太阳时近似、节气四柱、塔罗缩减规则、生命灵数和天体黄经。只引用仓库代码、官方库文档或可信测试样例。

不得把未经核验的 AI 回答写成黄金测试值。发现无法验证的算法时，在 docs/limitations.md 中记录，不要伪装成已完成能力。
```

## 城市扩展提示词

```text
扩展 Destiny Atlas 离线地点库。

每个地点必须提供：

- 稳定且唯一的英文 id
- 中文名和英文名
- 国家或中国省级行政区
- 可核验的城市中心纬度
- 可核验的城市中心经度
- 有效 IANA 时区

中国大陆统一使用 Asia/Shanghai，界面显示“中国标准时间 UTC+8”。不得为南京、广州、苏州、宁德等城市虚构 Asia/Nanjing、Asia/Guangzhou 等不存在或不适用的时区。

福建宁德和江苏苏州属于不可删除的回归样例。新增城市后补充唯一 ID、坐标范围、时区和搜索测试。

如果要支持全球任意城市，不要在前端暴露第三方 API Key。优先设计可替换的地理编码适配器、缓存和用户确认流程；无服务时必须继续支持离线地点和手动经纬度输入。
```

## GitHub 发布提示词

```text
完成 Destiny Atlas 修改后，按以下顺序发布：

1. git status -sb
2. 检查 git diff，排除缓存、密钥和临时截图。
3. npm run lint
4. npm run test
5. npm run licenses
6. npm run build
7. 从 main 创建独立功能分支。
8. 使用清晰、简短的提交信息。
9. 推送分支。
10. 创建 Draft Pull Request，正文说明修改、原因、用户影响、验证结果和已知限制。
11. 等待 GitHub Actions 完成。
12. 如果失败，读取真实日志后修复，不要猜测。

仓库：
https://github.com/Xiangyu2141480/destiny-atlas

线上站点：
https://xiangyu2141480.github.io/destiny-atlas/

禁止 force push，禁止把 API Key、Token、用户出生数据或本机私有路径写入仓库。
```

## Codex 汇报格式

要求 Codex 最终按以下格式汇报：

```text
完成内容

- 实际完成的功能和修复

代码证据

- 文件路径
- 组件、函数或类型名称
- 关键数据流

验证结果

- lint
- tests
- licenses
- build
- 浏览器验证尺寸和交互

待确认

- 尚未验证或需要产品决策的事项

发布信息

- 分支
- 提交
- PR
- GitHub Actions
- 线上地址
```

不要用“应该正常”“看起来没问题”代替验证结果。没有实际运行的项目、测试、浏览器或部署步骤必须明确标记为未验证。
