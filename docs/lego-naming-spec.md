# lego.css 命名规范（lego-naming-spec）

Version: 0.2  
Status: Draft

本规范定义 lego.css 原子类的 **命名规则与缩写约定**，目标是：

- 用一套稳定且可推导的命名体系覆盖 **全部标准 CSS 属性**（以 MDN CSS Reference 为准）。
- 兼容现有 lego.css 官网展示的语法（例如 `m10`、`bgc#f00`、`h:(bgc#f00)` 等）。
- 对人类友好、对 LLM / 工具也同样友好。

> 参考标准：  
> - MDN CSS Reference：完整 CSS 属性列表  
> - lego.css 官网示例：核心原子类与用法

---

## 1. 设计目标与范围

### 1.1 设计目标

1. **规则化**  
   - 任何 CSS 属性都能通过统一规则得到唯一缩写。
   - 核心高频属性有手工定义的「优雅缩写」，其余属性由自动命名算法兜底。

2. **兼容现有 lego.css 语法**  
   - 保留并优先采用目前官网示例中的命名，例如：
     - `m10` → `margin: 10px`
     - `bgc#f00` → `background-color: #f00`
     - `h:(bgc#f00 c#fff)` → `:hover { ... }`

3. **零配置可用**  
   - 不依赖项目级 theme/config 才能「存在」某个类名。
   - 只要 token 合法，就有确定的 CSS 输出。

4. **LLM 友好**  
   - 有一份小而稳定的「核心缩写表」。
   - 对于未列入核心表的属性，有清晰的自动命名算法，任何工具或 LLM 都可以按算法生成合法缩写。

### 1.2 覆盖范围

- **属性范围**：  
  - 所有在 MDN CSS Reference 中列出的标准 CSS 属性（不含浏览器私有前缀属性）。
- 不包含：
  - 浏览器私有属性（如 `-webkit-*`、`-moz-*`）。这些属性如需使用，按自动命名算法生成缩写即可。
  - 自定义属性（`--foo`）。这类属性仅通过 `var(--foo)` 等函数使用，本规范不为其定义缩写。

---

## 2. 全局命名约定（语法总则）

### 2.1 token 一般结构

一个 lego 原子类 token 的一般形式：

```text
[<断点前缀>:][<状态前缀>:]<核心缩写>[!]
```

核心缩写形如：

```text
<属性缩写>[<方向/轴/子属性>][-<关键字> | <数值> | [<复杂值>] ]
```

典型示例：

* `m10` → `margin: 10px`
* `m10-20` → `margin: 10px 20px`
* `bgc#f00` → `background-color: #f00`
* `d-flex` → `display: flex`
* `bd[1 solid #000]` → `border: 1px solid #000`
* `h:(bgc#f00 c#fff)` → `:hover { background-color:#f00; color:#fff }`
* `lh1.5!` → `line-height: 1.5 !important`

### 2.2 数值与单位

* **默认单位**：

  * 纯数字 → `px`

    * `m10` → `margin: 10px`
    * `fs16` → `font-size: 16px`
    * `bdrs8` → `border-radius: 8px`

* **显式单位**：

  * 数值后紧跟单位：`%` / `vh` / `vw` / `em` / `rem` 等

    * `w100%` → `width: 100%`
    * `h50vh` → `height: 50vh`
    * `fs1.2em` → `font-size: 1.2em`

* **小数**：

  * 支持如 `1.5`：`lh1.5` → `line-height: 1.5`
  * 不限制小数点位数（由实现决定精度）。

### 2.3 方向 / 轴后缀

适用于 `margin` / `padding` / `border` / `inset` 等 4 边或 2 轴属性：

* `t` / `r` / `b` / `l`：top / right / bottom / left
* `x` / `y`：水平方向 / 垂直方向

示例：

* `mt10` → `margin-top: 10px`
* `mx10` → `margin-left: 10px; margin-right: 10px`
* `p10-20` → `padding: 10px 20px`
* `bdt[2 dashed red]` → `border-top: 2px dashed red`

### 2.4 状态 / 伪类前缀

统一前缀：

* `h:` → `:hover`
* `a:` → `:active`
* `f:` → `:focus`
* `fv:` → `:focus-visible`（推荐补充的前缀）

使用方式：

* 单条：

  * `h:bgc#f00` → `:hover { background-color:#f00 }`
* 分组：

  * `h:(bgc#f00 c#fff p10)`
    → `:hover { background-color:#f00; color:#fff; padding:10px }`

### 2.5 `!important` 标记

* 任意 token 末尾 `!`：

  * `lh1.5!` → `line-height: 1.5 !important`
  * `m10!` → `margin: 10px !important`

* 分组内部：

  * `h:(s180! bgc#fae32f p1)`
    → `:hover` 内部所有声明追加 `!important`。

---

## 3. 核心属性映射（手工规范）

> 本章节列出 **手工指定的核心缩写**。
> 未在此章节中出现的属性，由第 4 章自动命名算法处理。

### 3.1 尺寸与间距（Sizing & Spacing）

#### 3.1.1 margin / padding

* `margin`：

  * `m<number>` → `margin`
  * `mt / mr / mb / ml` → 四边
  * `mx / my` → 左右 / 上下

* `padding`：

  * `p<number>` → `padding`
  * `pt / pr / pb / pl` / `px / py`

示例：

* `m10` → `margin: 10px`
* `m10-20` → `margin: 10px 20px`
* `mt10` → `margin-top: 10px`
* `p15` → `padding: 15px`

#### 3.1.2 width / height / size

* `width`：

  * `w<number>` → `width: <n>px`
  * `w<number><unit>` → 具体单位：

    ```text
    w100%  → width: 100%
    w50vw  → width: 50vw
    ```

* `height`：

  * `h<number>` → `height: <n>px`
  * `h<number><unit>` 类似：`h50vh` → `height: 50vh`

* 统一尺寸：

  * `s<number>` → `width` & `height` 同值：

    * `s200` → `width:200px; height:200px`

#### 3.1.3 min/max 尺寸

* `nw<number>` → `min-width`
* `nh<number>` → `min-height`
* `mw<number>` → `max-width`
* `mh<number>` → `max-height`

#### 3.1.4 box-sizing

* `bs-border-box` → `box-sizing: border-box`
* `bs-content-box` → `box-sizing: content-box`

#### 3.1.5 aspect-ratio

* `ar[<width>/<height>]` → `aspect-ratio`
  * 示例：`ar[16/9]`

#### 3.1.6 逻辑尺寸（inline / block 尺寸）

* 自动缩写：`inline-size` → `ins`，`block-size` → `bls`（保留自动算法，但在此列出便于查找）。
  * 示例：`ins100%` → `inline-size: 100%`

---

### 3.2 布局与显示（Layout & Display）

覆盖：`display`, `position`, `top/right/bottom/left`, `float`, `clear`, `z-index`, `overflow*`, `visibility`, `cursor` 等。

#### 3.2.1 display

* `d-block` → `display: block`
* `d-inline` → `display: inline`
* `d-inline-block` → `display: inline-block`
* `d-flex` / `d-inline-flex`
* `d-grid`
* `d-none`

#### 3.2.2 position 与偏移

* `p-static|relative|absolute|fixed|sticky`
* `t<number>` / `r<number>` / `b<number>` / `l<number>`
* 可选：`in<number>` → `inset: <n>px`

示例：

* `p-absolute t10 r10` → `position:absolute; top:10px; right:10px`

#### 3.2.3 float / clear

* `f-left|right|none`
* `cl-left|right|both|none`

#### 3.2.4 z-index

* `zi<number>` → `z-index: <n>`

#### 3.2.5 overflow

* `o-hidden|auto|scroll|visible` → `overflow`
* `ox-hidden|auto|scroll|visible` → `overflow-x`
* `oy-hidden|auto|scroll|visible` → `overflow-y`

#### 3.2.6 visibility / cursor

* `v-hidden|visible|collapse`
* `c-pointer|default|move|not-allowed|text|wait`

#### 3.2.7 交互/可用性（pointer/touch/外观）

* `poe-none|auto` → `pointer-events`
* `uss-none|auto|text|all` → `user-select`
* `tac-none|auto|pan-x|pan-y|manipulation` → `touch-action`（避免与 `ta`=text-align 混淆）
* `apr-none|auto` → `appearance`（常用于重置表单样式）

#### 3.2.8 滚动 / overscroll / 容器查询

* `scb-auto|smooth` → `scroll-behavior`
* `scst-x|y|block|inline|both`（可选 `-mandatory`/`-proximity`）→ `scroll-snap-type`
* `ovb-auto|contain|none` / `ovbx-*` / `ovby-*` → `overscroll-behavior(-x/-y)`
* `scc[<thumb> <track>]` → `scrollbar-color`；`scw-auto|thin|none` → `scrollbar-width`
* `cov-auto|hidden|visible` → `content-visibility`
* `con-none|strict|content|size|layout|style|paint` → `contain`
* `cois[...]` → `contain-intrinsic-size`
* `cot-size|inline-size|normal` → `container-type`
* `conm-<name>` → `container-name`

---

### 3.3 Flexbox

覆盖：`flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `flex`, `order`, `align-self` 等。

与官网示例保持一致：

* `fd-row|row-reverse|column|column-reverse` → `flex-direction`
* `fw-wrap|nowrap|wrap-reverse` → `flex-wrap`
* `jc-flex-start|flex-end|center|space-around|space-between|space-evenly` → `justify-content`
* `ai-stretch|flex-start|flex-end|center|baseline` → `align-items`
* `ac-stretch|flex-start|flex-end|center|space-around|space-between` → `align-content`
* `as-*` → `align-self`
* `o<number>` → `order`（注意与 `opacity` 共用前缀，由值域区分）
* `flex[<grow> <shrink> <basis>]` → `flex` 复合写法

示例：

```html
<div class="d-flex jc-center ai-center h100vh bgc#f0f0f0">
  ...
</div>
```

---

### 3.4 Grid（基础）

覆盖：`grid-template-*`, `grid-auto-*`, `gap`, `row-gap`, `column-gap` 等。

核心缩写：

* `d-grid` → `display:grid`
* `gtc[...]` → `grid-template-columns`
* `gtr[...]` → `grid-template-rows`
* `gta[...]` → `grid-template-areas`
* `gc[...]` → `grid-column`
* `gr[...]` → `grid-row`
* `gaf-row|column|dense|row-dense|column-dense` → `grid-auto-flow`
* `gp<number>` → `gap`
* `rg<number>` → `row-gap`
* `cg<number>` → `column-gap`

---

### 3.5 颜色系统（Color System）

覆盖：`color`, `background-color`, `border-color` 及其它 *-color 属性。

与现有示例对齐：

* `c<颜色>` → `color`

  * `c#f00`、`cred`
* `bgc<颜色>` → `background-color`

  * `bgc#97c430`、`bgcwhite`
* `bc<颜色>` → `border-color`

  * `bc#000`

其它颜色属性建议：

* `outline-color` → `olc<颜色>`
* `caret-color` → `cac<颜色>`
* `accent-color` → `acc<颜色>`

---

### 3.6 背景（Background）

覆盖：`background`, `background-image`, `background-repeat`, `background-position`, `background-size`, `background-attachment` 等。

* `bgc<颜色>` → `background-color`
* `bgi(url)` → `background-image: url(...)`
* `br-repeat-x|repeat-y|no-repeat|repeat` → `background-repeat`
* `bp-center|top|right|bottom|left` → `background-position`
* `bs-cover|contain|auto` 或 `bs<number>` → `background-size`
* `ba-fixed|local|scroll` → `background-attachment`
* `bac-padding-box|border-box|content-box` → `background-clip`
* `bao-padding-box|border-box|content-box` → `background-origin`
* `mibm-normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|difference|exclusion|hue|saturation|color|luminosity` → `mix-blend-mode`
* `bg[...]` → `background` 复合写法

---

### 3.7 边框 / 圆角 / 外轮廓 / 阴影

覆盖：`border*`, `border-radius*`, `outline*`, `box-shadow`, `text-shadow` 等。

与官网风格对齐：

* `bd[...]` → `border`

  * `bd[1 solid #000]`
* `bdt[...]` / `bdr[...]` / `bdb[...]` / `bdl[...]`
* `bw<number>` → `border-width`
* `bds-<style>` → `border-style`
* `bdrs<number>` → `border-radius`
* `ol[...]` → `outline`

  * `ol[2 solid #999]`
* `ts[...]` → `text-shadow`

  * `ts[1 2 3 #000]`
* `bsh[...]` → `box-shadow`（建议）
* `olo<number>` → `outline-offset`

---

### 3.8 字体与文本（Typography & Text）

覆盖：`font-*`, `line-height`, `letter-spacing`, `text-*`, `white-space`, `word-break`, `writing-mode` 等。

官网已有示例：

* `fs16` → `font-size: 16px`
* `fw-bold` → `font-weight: bold`
* `lh1.5` → `line-height: 1.5`
* `ta-center` → `text-align: center`
* `ls2` → `letter-spacing: 2px`
* `ts[1 2 3 #000]` → `text-shadow`

规范扩展：

* `font-size`：

  * `fs<number>` → `font-size: <n>px`

* `font-weight`：

  * `fw-bold|normal|bolder|lighter` 或 `fw<number>`

* `font-style`：

  * `fs-italic|fs-normal|fs-oblique`

* `font-family`：

  * `ff-k|ff-h|ff-s|ff-fs` 等（由内置 fonts.css 决定）

* `line-height`：

  * `lh<number|float>` → `line-height`

* `text-align`：

  * `ta-left|center|right|justify`

* `text-transform`：

  * `tt-none|capitalize|uppercase|lowercase`

* `text-indent`：

  * `ti<number|unit>` → `text-indent`

* `text-overflow`：

  * `to-clip|ellipsis` 等 → `text-overflow`

* `text-wrap`（新属性，注意兼容性）：

  * `twp-wrap|nowrap|balance|pretty` → `text-wrap`（`twp` 避开伪类缩写 `tw:`）

* `tab-size`：

  * `tbs<number>` → `tab-size`（避开 `ts`=text-shadow 冲突）

* `hyphens`：

  * `hy-none|manual|auto` → `hyphens`

* `text-decoration-*`：

  * `tdl-none|underline|overline|line-through` → `text-decoration-line`
  * `tdc<颜色>` → `text-decoration-color`
  * `tds-solid|dashed|dotted|double|wavy` → `text-decoration-style`
  * `td[...]` → 复合 `text-decoration`

* `white-space`：

  * `ws-normal|nowrap|pre|pre-line|pre-wrap`

* `word-break`：

  * `wb-normal|break-all|keep-all`

* `overflow-wrap`（`word-wrap`）：

  * `ow-normal|break-word|anywhere`

* `writing-mode`：

  * `wm-horizontal-tb|vertical-rl|vertical-lr`

---

### 3.9 动画 / 过渡 / 变换 / 滤镜

覆盖：`transition*`, `animation*`, `transform`, `filter`, `backdrop-filter` 等。

* `transform`：

  * `t[<函数>]` → `transform`

    * `t[translateY(-2px)]`

* `transition`：

  * `tr[<property> <duration> <timing> <delay>]` → `transition`
  * `trd<number>ms` → `transition-duration`
  * `trtf-ease|linear|ease-in|ease-out|ease-in-out` → `transition-timing-function`

* `animation`：

  * `ani[...]` → `animation` 复合
  * 可按需细分 `anid`（duration）、`anin`（name）等。

* `filter`：

  * `f[...]` → `filter`

* `backdrop-filter`：

  * `bf[...]` → `backdrop-filter`

* `transform-origin`：

  * `tro[...]` → `transform-origin`

* `transform-box`：

  * `trb-border-box|fill-box|view-box` → `transform-box`

* `backface-visibility`：

  * `bav-visible|hidden` → `backface-visibility`

* `will-change`（慎用，提醒性能成本）：

  * `wc-<property>` → `will-change`

---

### 3.10 列表 / 表格 / 其它

覆盖：`list-style*`, `border-collapse`, `border-spacing`, `caption-side` 等。

* 列表：

  * `lstt-none|disc|circle|square` → `list-style-type`
  * `lstp-inside|outside` → `list-style-position`
  * `lsti(url)` → `list-style-image`
  * `lst[...]` → `list-style` 复合

* 表格：

  * `bdc-collapse|separate` → `border-collapse`
  * `bds<number>` → `border-spacing`
  * `cs-top|bottom` → `caption-side`

---

## 4. 自动命名算法（Auto Naming）

> 目标：为 **未在 3.x 核心表中列出的属性** 提供统一、可预测的缩写规则。

### 4.1 属性名预处理

1. 去掉浏览器前缀：

   * `-webkit-text-fill-color` → `text-fill-color`
2. 按 `-` 分词：

   * `scroll-margin-block-start` → `["scroll","margin","block","start"]`

### 4.2 单词缩写规则

* 第一词：取前 2 个字母；
* 后续每个词：各取首字母；
* 拼接后总长度 **不超过 4 个字母**，超出则从末尾裁剪。

示例：

* `scroll-behavior` → `sbh`
* `content-visibility` → `cv`
* `contain-intrinsic-size` → `cis`
* `scroll-margin-block-start` → `smbs`

### 4.3 冲突解决

若自动生成的缩写与已有核心缩写冲突：

1. 核心缩写优先保留；
2. 冲突属性的缩写末尾追加一位字母：

   * 例如：`box-sizing` → `bs` 已作为核心缩写使用，则
   * `block-size` 自动缩写可以调整为 `bls`。

### 4.4 值形式

* **数值型属性**：

  * `<缩写><数字>` 或 `<缩写><数字><单位>`：

    * `sbh-` 系列例子略；
* **关键字型属性**：

  * `<缩写>-<关键字>`：

    * `cv-auto` → `content-visibility: auto`
* **复杂值**：

  * `<缩写>[原生 CSS 值]`：

    * `cis[10px 20px]` → `contain-intrinsic-size: 10px 20px`

通过该算法，理论上可以为所有标准 CSS 属性定义一个唯一缩写。

---

## 5. 对 LLM / 工具的使用建议

1. **优先使用第 3 章中的核心缩写**

   * 这些是最常见、最稳定的命名，官方保证长期兼容。

2. 遇到未列出的属性时：

   * 若实现方已提供手工映射，以实现为准。
   * 否则按第 4 章自动命名算法生成缩写。

3. 不要发明规范外的缩写：

   * 不要在项目中自定义新的前缀，而是通过 theme / 变量层做抽象。

4. 伪类 / 断点组合建议：

   * 状态前缀始终放在属性缩写前面，例如 `h:`/`f:`/`fv:`。
   * 断点前缀（如未来引入 `md:` 等）放在状态之前：`md:h:(...)`。

---

## 6. 版本与兼容性策略

* **v0.2**：

  * 同步 `appendix-auto-abbr` v0.2 补充的核心/推荐缩写，覆盖 aspect-ratio、pointer/user-select/touch-action/appearance、滚动与容器查询、背景 clip/origin/mix-blend、文本缩写避冲突（`twp`/`tbs`）、3D/动画补全（`tro`/`trb`/`wc` 等）。
  * 调整 `accent-color` 缩写为 `acc`，与 runtime/附录保持一致。

* **未来版本变更原则**：

  1. 已发布的核心缩写尽量保持不变。
  2. 若必须调整缩写：

     * 提供迁移指引；
     * 在过渡期内，通过构建/运行时支持旧缩写 alias。
  3. 新增 CSS 属性或新模块时：

     * 优先尝试用自动命名算法；
     * 若出现广泛使用，则再晋级为「手工命名」写入第 3 章。

---

```
[1]: https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference?utm_source=chatgpt.com "CSS 参考 - CSS：层叠样式表 | MDN"
[2]: https://legocss.dev/ "lego.css - 像乐高积木一样写CSS | 原子化CSS框架"
```
