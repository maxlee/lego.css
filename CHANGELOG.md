# Changelog

## 2025-11-29
- ✨ Change: runtime 数值解析新增无默认单位缩写白名单（`lh/zi/fw/op`），数值 0 不再自动补 `px`，与 Uno 规则保持一致。
- ✨ Change: 支持 `px|em|rem|vh|vw|%|svh|lvh|svw|lvw|dvw|svi|lvi|dvb` 长度单位，防止新视口单位被误判为需要追加默认单位。
- 📁 Docs: README 补充默认单位/无单位属性说明，便于对齐 DSL 约定。
- 🐛 Fix: 去除缩写级无单位白名单，统一按属性名判定无单位（`line-height`/`z-index`/`font-weight`/`opacity`），并在 demo 增加示例覆盖 `fw600` 等裸数输出。
- ✨ New: 核心缩写表补充 text-indent/direction/unicode-bidi/text-justify/vertical-align/word-spacing/word-wrap、背景附件/位置/重复/尺寸以及 list-style* 映射，和 demo 示例对应。
- 🐛 Fix: `abbr[...]` 透传时自动修正 `calc()` 运算符缺空格（如 `w[calc(100%-20px)]` → `calc(100% - 20px)`），避免无效声明；demo 补充示例。
- ✨ Change: 按属性类型区分单位种类（length/angle/time/resolution/frequency），`transition-duration` 等缺单位默认补 `ms`，避免将时间误判为长度；demo 增加时间单位示例。
- 📁 Docs: 新增 `docs/llms.txt` 值类型→命名模板对照表，附示例类名与 CSS 及常见陷阱；README 链接指南。
- 🐛 Fix: debug 模式下新增未知单位/关键字警告，便于排查无效值；demo 增加触发警告的示例（`w10foo`、`d-flexx`）。
- 🐛 Fix: 补充核心缩写别名 `bdc`/`list` 以支持 `bdc#...`、`list-*`，伪类解析允许 `:has[...]` 内带 `:`，兼容 `bd:1-solid-...` 旧写法、`bgi[...]` 自动补 url()；demo 中将 `list-*` 调整为 `lst-*` 并修正边框颜色伪类示例。

## 2025-11-26
- 📁 Docs: 更新 `docs/appendix-auto-abbr.md` 至 v0.2，补充 MDN 高频属性的核心/推荐缩写与避冲突策略。
- 📁 Docs: 同步 `docs/lego-naming-spec.md` 与附录，晋升新缩写（如 `ar`、`uss/poe/tac`、`scb/scst/ovb*`、`twp/tbs`、`tro/trb/wc` 等），并统一 `accent-color` 缩写为 `acc`。

## 2025-11-25
- ✨ New: Runtime 支持断点前缀 `sm/md/lg/xl/2xl`，将对应样式包裹到 `@media (min-width: ... )` 中。
- ✨ New: 在 `docs/demo.html` 增加响应式示例，展示断点前缀与核心缩写的组合。
- 📁 Docs: 更新 README 说明断点前缀，刷新 `docs/todo.md` 以反映当前待办。
- ✨ New: 扩充伪类支持（链接、表单、结构伪类及带参数的 `:nth-child/:not/:has` 等），runtime 可解析 `xxx[...]` 形式伪类前缀；`docs/demo.html` 增加对应示例。
- 🐛 Fix: 优化 `numberOrLength` 处理，`line-height` 等无单位数值保持裸 number，其他默认补 `px`；demo 增加对比示例。
- ✨ Change: 伪元素前缀改为 `name::` 形式（如 `af::` → `::after`），并在 demo 中演示 ::placeholder 与 ::after 徽标。
- ✨ Change: 伪元素支持 group 语法（如 `ph::(c#94a3b8 fs12)`），便于一次设置多个声明。
- 🐛 Fix: 提升缓存版本到 v3，伪元素 group 类名现在会展开为独立 token（如 `ph::c#0f0 ph::fs12`），避免带空格类名导致选择器不命中。
- 🐛 Fix: 回退伪元素多声明短横线分隔，统一使用括号+空格形式（如 `ph::(c#0f0 fs12 p2-4)`）自动展开为多个合法 token。
- ✨ New: 支持 `ct` 缩写映射 `content`，可用于伪元素 `af::ct['']`，demo 中已展示空内容徽标。
- ✨ New: 引号形式值（如 `ct''` / `ct"..."`）直接透传，便于为伪元素设置 `content:''`。
- ✨ New: 扩充伪类/伪元素映射（any-link/read-only/indeterminate 等伪类，backdrop/cue/slotted 等伪元素）并新增参数伪类/伪元素生成器（如 `ntl[...]`、`lg[...]`、`slt[...]`），未知前缀在 debug 下会给出警告。
- 📁 Docs: demo 增加 :any-link、:read-only、:nth-last-child 参数伪类示例。
