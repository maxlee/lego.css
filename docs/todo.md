# lego.css TODO（命名规范落地）

## 尚未覆盖或不一致
- 伪类覆盖不足：仅内置 `h/a/f/fv/fw/ch/ds/em/fc/lc`，缺少链接、表单、结构、函数伪类（如 `:visited/:target/:nth-child/:not/:has` 等），带参数伪类（`nt[2n+1]` 等）无法解析，未知前缀被标记为 unknown 后丢弃。
- 伪元素/伪类命名空间未强制区分：虽然使用 `e-` 前缀，但与伪类同用一张映射表，缺少更全面的伪元素覆盖和校验。
- `numberOrLength` 处理不一致：无单位数字既可能是 `<number>` 也可能应补默认 `px`，目前 `lh20` 输出裸 `20`，与“默认数字=px、特定属性优先无单位 number”规则未对齐。
- 缩写与方向的 BNF 校验缺失：`resolveAbbrAndDir` 未限制缩写/方向字符集和长度，可能接受不符合 `[a-z]{1,4}` 的输入。
- 自动命名的类型元数据缺失：`bootstrapAutoAbbrFromStyle` 为所有属性注册 `numberOrLength`，未结合属性的真实类型或方向信息，导致生成的缩写缺少正确的 numericType/directions。
- 文档同步缺口：尚未在 README/CHANGELOG 中记录上述规范差异或落地状态。

## Suggestions（落地方向）
- 扩充伪类/伪元素映射并支持参数：按 MDN 列表补齐常用项，解析 `xxx[...]` 形式将括号内容拼入 selector，调试模式下对未知前缀给出警告。
- 优化 `numberOrLength` 逻辑：根据 meta 决定无单位数字是否补 `px`（length 型）或保持裸数（纯 number 型），确保 `line-height` 等属性符合规范预期。
- 添加缩写/方向校验：在拆分缩写前先校验 `[a-z]{1,4}` 和合法方向后缀（如 `t/r/b/l/x/y`），非法时抛错或在 debug 下告警。
- 为自动命名提供类型元数据：`autoAbbr` 接收 optional 的 `numericType`/`directions`；或维护属性类型表，避免默认全部注册为 `numberOrLength`。
- 分离伪类/伪元素命名空间：保持 `e-` 家族专属映射，伪类单独映射并更全面覆盖，避免两类前缀互相污染。
- 同步文档：补充 README/CHANGELOG 对当前支持范围与待办项的说明，确保规范与实现一致。
