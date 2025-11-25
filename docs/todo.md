# lego.css TODO（命名规范落地）

## 尚未覆盖或不一致
- 缩写与方向的 BNF 校验缺失：`resolveAbbrAndDir` 未限制缩写/方向字符集和长度，可能接受不符合 `[a-z]{1,4}` 的输入。
- 自动命名的类型元数据缺失：`bootstrapAutoAbbrFromStyle` 为所有属性注册 `numberOrLength`，未结合属性的真实类型或方向信息，导致生成的缩写缺少正确的 numericType/directions。
- 文档同步缺口：尚未在 README/CHANGELOG 中记录上述规范差异或落地状态。
- 文档建议的“自动命名”算法对新属性给出 numeric 类型或方向元数据的策略还未落地：bootstrapAutoAbbrFromStyle 一律注册 numberOrLength，未结合 MDN 类型信息。
- 未实现“所有东西都落在这一模式”中的 Breakpoint 段、完整 MDN 伪类/伪元素枚举，也未在 README/CHANGELOG 中记录规范。
## Suggestions（落地方向）
- 优化 `numberOrLength` 逻辑：根据 meta 决定无单位数字是否补 `px`（length 型）或保持裸数（纯 number 型），确保 `line-height` 等属性符合规范预期。
- 添加缩写/方向校验：在拆分缩写前先校验 `[a-z]{1,4}` 和合法方向后缀（如 `t/r/b/l/x/y`），非法时抛错或在 debug 下告警。
- 为自动命名提供类型元数据：`autoAbbr` 接收 optional 的 `numericType`/`directions`；或维护属性类型表，避免默认全部注册为 `numberOrLength`。
- 同步文档：补充 README/CHANGELOG 对当前支持范围与待办项的说明，确保规范与实现一致。
