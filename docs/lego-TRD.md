# lego.css 技术设计文档（TRD）

版本：0.1  
状态：Draft  
目标读者：架构 / 前端 / 工具链 / Prompt 工程

---

## 1. 设计目标 & 关键原则

### 1.1 目标回顾

- 提供一个 **LLM-first** 的 Atomic CSS DSL；
- 零配置覆盖尽可能完整的标准 CSS 属性集合（以 MDN CSS Reference 为准）；  
- 同时支持：
  - 浏览器端 runtime（方便 Demo / AI Playground）；
  - 构建期编译（在 Vite / Webpack / esbuild 等环境中与 UnoCSS 类似地按需生成 CSS）。  

### 1.2 设计原则

1. **规则 > 特例**  
   - 所有 token 都应服从一个统一的语法模型；
   - 少数核心属性可以有“短名”，但不能破坏整体可推导性。
2. **高频短名优先**  
   - 高频属性保留一两个字符的缩写；
   - 低频属性使用自动生成的 3–4 位缩写。
3. **一切以标准 CSS 为真相源**  
   - 不引入任何新的“语义层级”（如 theme token / 语义色板）；
   - Lego 仅仅是 CSS 属性的机械缩写与组合层。
4. **LLM & 工具友好**  
   - 全部规范都要有 Markdown + JSON 两种形式；
   - 提供 llms.txt / llms-full.txt 方便模型 ingest；  
   - 接口尽量 idempotent / 无副作用，方便在 REPL 与测试中反复调用。

---

## 2. DSL 语法设计

### 2.1 Token 结构（Grammar）

**Token 一般形式：**

```text
[Breakpoint ":"]* [Pseudo ":"]* Core [ "!"]
```

* `Breakpoint`：如 `sm` / `md` / `lg`（P1 实现）；
* `Pseudo`：伪类前缀（`h` / `a` / `f` / `fv` 等）；
* `!`：可选 `!important` 标记。

**Core 结构：**

```text
Core       := PropAbbr [DirectionOrSub] Value
PropAbbr   := 1–4 小写字母（属性缩写）
DirectionOrSub := "" | ("t"|"r"|"b"|"l"|"x"|"y") | 其他子属性缩写
Value      := NumberValue | KeywordValue | BracketValue
NumberValue := Number [Unit]
KeywordValue := "-" CanonicalCSSKeyword
BracketValue := "[" RawCssValue "]"
```

例子：

* `m10` → `margin: 10px;`
* `mt10-20` → `margin-top: 10px 20px;`（具体拆分见实现）
* `bgc#f00` → `background-color: #f00;`
* `d-flex` → `display: flex;`
* `bd[1 solid #000]` → `border: 1px solid #000;`
* `h:(bgc#f00 c#fff p10)` → 解析出 3 个 token，挂到 `:hover` 上；
* `lh1.5!` → `line-height: 1.5 !important;`.

### 2.2 数值与单位语义

* 默认数值单位：`px`

  * `m10` → `margin: 10px;`
  * `fs16` → `font-size: 16px;`
* 显式单位通过后缀表达：

  * `w100%` → `width: 100%;`
  * `h50vh` → `height: 50vh;`
  * `fs1.2em` → `font-size: 1.2em;`
* 对既可 number 又可 length 的属性（如 `line-height`）：

  * 约定：无单位时按 number 解析，有单位时按 length 解析。

### 2.3 多值语法

只保留两种形式：

1. **简单短横形式**（最多 4 段）：

   * `m10-20` → `10px 20px;`
   * `m10-20-30-40` → `10px 20px 30px 40px;`
   * `bdrs10-0` → `border-radius: 10px 0;`

2. **通用 `[]` 形式**：

   * `m[10 20]` → `margin: 10px 20px;`
   * `bdrs[10 0 10 0]`.

不再使用 `|`／空格等自创分隔符，简化解析。

### 2.4 状态 / 伪类前缀

**伪类前缀命名空间：**

* 一位：

  * `h:` → `:hover`
  * `a:` → `:active`
  * `f:` → `:focus`
* 两位：

  * `fv:` → `:focus-visible`
  * `fw:` → `:focus-within`
  * `ch:` → `:checked`
  * `ds:` → `:disabled`
  * `em:` → `:empty`
  * `fc:` → `:first-child`
  * `lc:` → `:last-child`
  * `nt[...]` → `:nth-child(...)`
  * `ntt[...]` → `:nth-of-type(...)`
  * 等其他从 MDN 伪类列表中选定的常用项。

用法示例：

```text
h:bgc#f00              → :hover { background-color:#f00 }
ch:c#0f0               → :checked { color:#0f0 }
nt[2n+1]:bgc#eee       → :nth-child(2n+1) { background-color:#eee }
h:(bgc#f00 c#fff p10)  → :hover { ...三条声明... }
```

### 2.5 伪元素前缀

为避免与伪类抢字母，伪元素统一使用一组独立前缀（建议 `e-` 家族）：

* `e-bf:` → `::before`
* `e-af:` → `::after`
* `e-fl:` → `::first-letter`
* `e-f1:` → `::first-line`
* `e-ph:` → `::placeholder`
* `e-sel:` → `::selection`
* `e-mr:` → `::marker`
* `e-fsb:` → `::file-selector-button`
* 其余罕见伪元素用自动算法派生（按名字切词）。

示例：

```text
e-af:(c#f00 fs12)      → ::after { color:#f00; font-size:12px; }
h:e-ph:(c#999)         → :hover::placeholder { color:#999; }
```

### 2.6 `!important` 语义

* 单 token：末尾加 `!`：

  * `lh1.5!` → `line-height: 1.5 !important;`
* 分组：在组内每个声明后统一加 `!`：

  * `h:(bgc#f00! c#fff)` → `:hover { background-color:#f00!important; color:#fff!important }`.

---

## 3. 命名系统设计

### 3.1 核心缩写表（core）

* 高频属性拥有手工定义的极简缩写（详见 `lego-naming-spec.md`）：

  * Box：`m/p/w/h/s/mw/mh/nw/nh/bs-...`
  * Color：`c/bg c/bc`
  * Typography：`fs/fw/lh/ta/ls/ts/ff-...`
  * Layout：`d/p-.../t/r/b/l/zi/o/ox/oy/v/c-...`
  * Flex：`d-flex/jc/ai/ac/o-...`
  * Border：`bd/bdt/bdr/bdb/bdl/bw/bds/bdrs/ol`
  * Transform：`t[...]`
  * 等约 80–120 条。

**技术实现**：

* 在 `@lego/core` 中内置一份 `CORE_ABBR_MAP`；
* 同时根据该表反向生成 `PROP→ABBR` 和 `ABBR→PROP` 映射。

### 3.2 自动命名算法（auto）

对所有 **不在核心表中的属性**，采用统一算法：

1. 去掉浏览器前缀（`-webkit-` / `-moz-` 等）；
2. `-` 切词；
3. 第一词取前 2 字母；后续每词取首字母；
4. 拼接后长度 > 4 → 从末尾裁剪到 4；
5. 若与现有缩写冲突，则：

   * 若冲突的是核心缩写 → 调整当前属性缩写（加一位）；
   * 若冲突的是低频属性 → 以“谁先定义”决定优先级。

**自动缩写示例**（详见 `appendix-auto-abbr.md`）：

* `scroll-behavior` → `scb` → `scb-smooth`
* `content-visibility` → `cov` → `cov-auto`
* `contain-intrinsic-size` → `cois` → `cois[auto 500px]`
* `font-variant-caps` → `fovc` → `fovc-small-caps`

---

## 4. 架构设计

### 4.1 模块拆分

1. **核心库 `@lego/core`（无 DOM 依赖）**

   * `tokenizer`：把字符串拆成 token（含状态前缀、核心 body、是否带 `!`）；
   * `parser`：把单个 token 解析成 `{ property, value, variants[] }`；
   * `cssEmitter`：从解析结果生成 CSS 规则；
   * `naming`：核心缩写表 + 自动命名算法 + 冲突处理；
   * `registry`：缓存已生成规则，避免重复输出。

2. **浏览器 runtime `lego.runtime.js`**

   * 基于 `@lego/core`，实现：

     * `applyTo(root: HTMLElement)`：从 root 下面扫描 class，生成 CSS；
     * 使用 `MutationObserver` 监听 DOM 变化，增量更新；
     * 将生成的 CSS 注入 `<style data-lego>` 标签。

3. **构建期插件（MVP 先做 Vite）**

   * 集成方式参照 UnoCSS / WindiCSS：

     * 在 Vite 插件生命周期 hook 中扫描源码（`transformIndexHtml` / `handleHotUpdate` 等）；
     * 调用 `@lego/core` 提取 token 并生成 CSS；
     * 输出单独 CSS 文件或注入到 bundle 中。

4. **文档 & AI 支持模块**

   * `lego-naming-spec.*`；
   * `appendix-auto-abbr.*`；
   * `llms.txt` / `llms-full.txt`。

### 4.2 运行时流程（浏览器）

1. 页面加载时：

   * runtime 检测是否已有 `<style data-lego>`，没有则创建；
2. 扫描：

   * 深度遍历 DOM，读取 `class` 属性，按空白符拆分；
   * 对每个 token 调用 `core.compileToken`；
   * 若生成新规则，则 append 到 `<style data-lego>`；
3. 动态更新：

   * 通过 `MutationObserver` 监听：

     * 新增节点；
     * 节点 `class` 属性变化；
   * 对变更范围重新执行扫描 / 编译；
4. 去重：

   * 使用 `Map<string, boolean>` 存储已编译 token，避免重复生成 CSS。

### 4.3 构建期流程（以 Vite 为例）

1. 插件初始化时，创建 `TokenRegistry`；
2. 在 `transform` 阶段：

   * 对 `.html/.jsx/.tsx/.vue` 文件执行简单扫描（基于正则 + 约定），提取所有可能的 class 字符串；
   * 调用 `core.tokenizer` → token 列表；
   * 注册到 `TokenRegistry`；
3. 在 `generateBundle` 阶段：

   * 对 `TokenRegistry` 中所有 token 调用 `core.compileToken`，生成 CSS；
   * 输出 `lego.css` 到 bundle。

> 备注：MVP 可以只支持静态类字符串（不支持复杂模板字符串 / 动态拼接），后续逐步增强。

---

## 5. 解析与生成细节

### 5.1 Tokenizer 规则

* 支持：

  * 普通空白分隔：`"m10 bgc#f00 d-flex"`；
  * group：`h:(bgc#f00 c#fff)`，按小括号匹配；
  * 伪类前缀链：`md:h:bgc#f00`（P1 才支持 breakpoint）；
* 不支持：

  * 嵌套括号（`()` 内部不再处理 group），只解析到 `]` / `)` 平衡；
  * 带空格的 class 名（这是 HTML 不合法的情况）。

### 5.2 Parser 规则

对每个 token：

1. 拆掉结尾 `!`，记下 `important: true`；
2. 从头解析前缀：

   * 连续的 `<word>:` 视作 variant 列表（伪类 / 断点）；
3. 剩余部分解析为 `PropAbbr + DirectionOrSub + Value`：

   * 优先从核心表匹配固定缩写；
   * 否则交给自动命名映射；
   * Direction/子属性根据约定（`t/r/b/l/x/y`、`bdt/bdr` 等）匹配。

输出结构示例：

```ts
{
  property: "margin",
  value: "10px 20px",
  variants: [
    { type: "pseudo", name: ":hover" },
    { type: "breakpoint", name: "@media (min-width:768px)" }
  ],
  important: false
}
```

### 5.3 CSSEmitter 规则

* 选择器策略：

  * MVP：使用类选择器 `[class~="TOKEN"]`：

    * 好处：简单、不需要生成新类名；
    * 坏处：长选择器，CSS 体积稍大。
  * 后续可考虑把 `TOKEN` hash 成 `.l-xxxx` 并在 DOM 中替换，但对 runtime 难度较大。

* 生成伪类 / 媒体查询：

  * variants 按顺序包装选择器：

    * 断点 → 媒体查询；
    * 伪类 → 追加在选择器末尾；
    * 伪元素 → 接在伪类后。

---

## 6. 兼容性与性能

### 6.1 兼容性

* 浏览器目标：

  * 现代 Evergreen 浏览器（Chrome/Firefox/Safari/Edge 最近两个大版本）；
* CSS 属性：

  * 允许输出“部分浏览器尚未支持”的新属性（如某些 View Transitions / Container Queries 相关属性），由开发者自行评估兼容性；

### 6.2 性能目标

* runtime：

  * 初始扫描在 1k~2k DOM 节点下耗时 < 10ms（桌面）；
  * MutationObserver 增量更新开销可忽略不计（只对小范围节点解析）。
* 构建期：

  * 对一个含 100~200 个文件的中小项目，扫描 & 编译开销控制在秒级；
  * 理论上性能目标参考 UnoCSS 级别（但不要求立刻达到）。

---

## 7. LLM 集成设计

### 7.1 文档文件

* `llms.txt`：

  * 简述 lego.css 是什么；
  * 链接到：

    * 入门文档；
    * 命名规范（简版）；
    * 对照表（Tailwind → lego）；
* `llms-full.txt`：

  * 整合所有关键文档内容，方便模型一次性 ingest。

### 7.2 JSON 规则文件

* `lego-naming-spec.json`：

  * 列出核心属性缩写（`props`）；
  * 描述自动命名算法（`autoNaming`）；
  * 给出多个 “class → CSS” 示例；
* 推荐在 LLM Prompt 中直接内嵌或以 URL 形式引用此 JSON。

### 7.3 Prompt & 评测

* 官方提供：

  * 一段“教 LLM 如何使用 lego.css”的标准 Prompt；
  * 一组评测用的自然语言 → UI 任务；
  * 对比 Tailwind / 原生 CSS 的成功率。

---

## 8. 测试与验收

### 8.1 单元测试

* `naming.test`：

  * 核心缩写映射是否正确（属性正反查）；
  * 自动命名算法对若干 MDN 属性的生成结果是否符合预期；
* `parser.test`：

  * 典型 token（含伪类、group、多值、`!`）的解析结果；
* `emitter.test`：

  * 给定 token → CSS 规则字符串是否符合预期。

### 8.2 集成测试

* runtime：

  * 在真实浏览器中挂载 demo HTML，检查最终 computed style；
* 构建插件：

  * 对一个小 demo 项目跑完整 build，检查输出 CSS 与预期快照对比。

### 8.3 LLM 评测（非强制，但建议）

* 设计一组 task，让模型在没有 / 有 lego 文档情况下生成代码；
* 统计：

  * token 合法率；
  * 样式实现正确率；
  * 类名“不可解析”的比例。

---

## 9. 风险 & 未决问题

1. **命名冲突 & 可记忆性**

   * 自动算法一定会产生一些“人类难记”的缩写，是否需要调整部分映射；
2. **VSCode / 编辑器支持**

   * 如果没有补全 & hover，开发体验会打折扣；
3. **和现有 Tailwind / UnoCSS 共存**

   * 项目里同时使用多个 Atomic 体系时，类名冲突和 mental model 冲突如何处理；
4. **生态规模**

   * 如果只在 AI 圈流传，而不进入真实工程项目，长期维护动力会不足。

---

## 10. 结论

* lego.css 不是“一个 CSS 框架”，而是“面向 LLM 的 CSS 子语言 + 工具链”；
* 本 TRD 描述了 DSL、命名规则、核心/自动缩写、运行时与构建期架构；
* 下一步工作：

  1. 敲定核心缩写表（收敛到 ~100 条）；
  2. 用 TypeScript 实现 `@lego/core` 的最小可用版本；
  3. 同步更新 `lego-naming-spec.md` / `appendix-auto-abbr.md` / `lego-naming-spec.json`；
  4. 发布第一版 runtime 与简单 Vite 插件。
