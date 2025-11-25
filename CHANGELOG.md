# Changelog

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
