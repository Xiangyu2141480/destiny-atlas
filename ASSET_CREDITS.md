# Asset Credits

## 自制视觉资产

本次重设计未引入第三方图片、图标库、插画、视频、3D 模型或 Web Font。AI 生成插画不含第三方品牌名称、标志或复制指定角色的提示。

- Hero 多层天体仪：项目内原创 SVG，见 `src/components/CelestialInstrument.tsx`
- 交互星盘：基于项目计算结果实时绘制的原创 SVG，见 `src/components/NatalChart.tsx`
- 星场、极光、网格、噪点与材质：项目内 CSS 渐变及内联 SVG filter，见 `src/styles.css`
- 塔罗牌正反面：项目内 CSS 图形与文本排版，牌名及编号来自既有确定性计算结果
- 四色 MBTI 人格星图符印：项目内原创参数化 SVG，见 `src/components/PersonalityCards.tsx`
- 16 张 MBTI 拟人星象插画：使用 TRAE 图像生成能力按本项目原创提示词生成，经压缩为 WebP，位于 `public/assets/mbti/`；画面融合原创角色、黄道、塔罗构图、月相和炼金术图案
- 装饰字符：使用 Unicode 字符 `✦`、`☾` 与 `↗`，不构成外部资产

## 未采用的第三方视觉

项目未复制、下载或再分发 16Personalities 的官方人物插画。其网站条款声明网站材料及产品相关知识产权由该网站或授权方保留，未提供适用于本 MIT 开源项目的插画再分发许可。若未来取得书面授权，可通过独立资产映射替换原创符印，但必须同时记录授权范围、来源和使用位置。

## 字体

页面使用操作系统自带字体栈：

- 界面与数据：Inter（如本机存在）、Avenir Next、PingFang SC、Microsoft YaHei、sans-serif
- 标题与文学排版：Iowan Old Style、Baskerville、Songti SC、Georgia、serif

项目不下载、打包或再分发字体文件。用户设备会按字体栈选择本地可用字体。

## 第三方代码依赖

应用依赖许可由 `package.json` 中的 `npm run licenses` 检查。完整锁定版本见 `package-lock.json`；项目自身代码采用 MIT License。

## 2026-10-09 动效增强

沿用黑金天文馆的原创 SVG、CSS 氛围与系统字体。新增公转光点、星点错峰闪烁、细流星、呼吸光晕、天体仪轻浮和交互涟漪，均由项目内 CSS / SVG 实现；不使用新增第三方图片、字体、模型、图标库或动画库。装饰动效不承载真实天文计算。
