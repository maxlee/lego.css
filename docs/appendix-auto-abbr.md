# Appendix: Auto-generated Abbreviations (lego.css)

Version: 0.2  
Status: Draft

本附录用于说明 **lego.css 自动生成缩写的算法与示例**，并展示如何在该算法之上，为常用属性保留更短的「核心缩写」。

本版新增（v0.2）：

- 依据 MDN CSS Reference 补充了一批现代高频属性的「推荐/晋升核心」缩写（如 `ar`、`uss`、`poe`、`scb`、`scst`、`ovb*`、`cov`、`apr`、`tac` 等）。
- 补充文字排版与交互相关的避冲突缩写（如 `twp` 避开伪类 `tw:`，`tbs` 避开 `ts`）。
- 标注滚动/容器、背景混合、3D/动画等常见属性的友好别名，方便对照自动缩写算法使用。

核心原则：

1. **高频属性优先使用极简缩写**（`m`, `p`, `w`, `h`, `bgc`, `c`, `fs`, `fw`, `lh`, `ta` 等），这些缩写在主规范中手工定义；
2. **低频属性使用自动生成的 3–4 位缩写**，保证命名空间对所有 CSS 属性闭合；
3. 若自动生成的缩写与核心缩写冲突，**核心缩写（高频属性）优先保留**，低频属性改用更长的自动缩写。

> 说明：  
> - CSS 属性集合以 MDN CSS Reference 为准。  
> - 本附录只展示 **自动缩写算法** 的效果，完整命名规范见 `lego-naming-spec.md`。

---

## 1. 保留的核心极简缩写（优先级最高）

这些是 lego.css 规范中 **已经手工定义的高频缩写**，自动算法必须避让：

| CSS 属性              | lego 核心缩写 | 说明 / 示例                   |
|-----------------------|--------------|-------------------------------|
| `margin`              | `m`          | `m10` → `margin:10px`         |
| `padding`             | `p`          | `p10` → `padding:10px`        |
| `width`               | `w`          | `w100%` → `width:100%`        |
| `height`              | `h`          | `h50vh` → `height:50vh`       |
| `width` + `height`    | `s`          | `s200` → `w:200px; h:200px`   |
| `color`               | `c`          | `c#333` → `color:#333`        |
| `background-color`    | `bgc`        | `bgc#f00`                     |
| `border`              | `bd`         | `bd[1 solid #000]`            |
| `border-radius`       | `bdrs`       | `bdrs8` → `border-radius:8px` |
| `font-size`           | `fs`         | `fs16`                        |
| `font-weight`         | `fw`         | `fw-bold` / `fw700`           |
| `line-height`         | `lh`         | `lh1.5`                       |
| `text-align`          | `ta`         | `ta-center`                   |
| `display`             | `d`          | `d-flex` / `d-grid`           |
| `position`            | `p-…`        | `p-absolute` / `p-fixed`      |
| `justify-content`     | `jc`         | `jc-center`                   |
| `align-items`         | `ai`         | `ai-center`                   |
| `align-content`       | `ac`         | `ac-space-between`            |
| `overflow`            | `o`          | `o-auto` / `o-hidden`         |
| `visibility`          | `v`          | `v-hidden` / `v-visible`      |
| `cursor`              | `c-…`        | `c-pointer`                   |
| `z-index`             | `zi`         | `zi100`                       |
| `text-shadow`         | `ts`         | `ts[1 2 3 #000]`              |
| `outline`             | `ol`         | `ol[2 solid #999]`            |
| `transform`           | `t`          | `t[translateY(-2px)]`         |

> 这些缩写来自 lego.css 第一版命名原则与官网示例，是最常使用的一批，因此保留最短形式。

---

## 2. 自动命名算法（Auto-naming Algorithm）

对于 **未在核心表中显式声明的 CSS 属性**，lego.css 使用以下算法自动生成缩写：

1. **预处理属性名**  
   - 去除浏览器前缀（`-webkit-`、`-moz-`…）；  
   - 按 `-` 切分成单词数组。  
   - 例：`scroll-margin-block-start` → `["scroll","margin","block","start"]`。

2. **生成基础缩写**  
   - 第一词取前 2 个字母；  
   - 每个后续词取首字母；  
   - 拼接后若长度 > 4，则从末尾裁剪到 4 位。  
   - 例：  
     - `scroll-behavior` → `sc` + `b` → `scb`  
     - `content-visibility` → `co` + `v` → `cov`  
     - `contain-intrinsic-size` → `co` + `i` + `s` → `cois`（长度 4，保留）

3. **冲突处理（高频优先）**  
   - 若自动生成结果与 **核心缩写** 或已使用的其它缩写冲突：  
     1. 核心缩写总是保留（高频属性优先使用极简缩写）；  
     2. 冲突的低频属性，将其缩写拉长或调整，例如：  
        - 加上下一词首字母或属性家族前缀；  
        - 如 `boc` 与已有 `bc` 冲突时，可改为 `boc`→`boic` 等更长形式。

4. **值语法**  
   - 数值：`<abbr><number>` 或 `<abbr><number><unit>`  
   - 关键字：`<abbr>-<css-keyword>`  
   - 复杂值：`<abbr>[原生 CSS 值]`

---

## 3. 自动缩写示例（带核心缩写对比）

下面示例表展示：当某些属性有核心极简缩写时，**同族其它低频属性使用自动缩写**，两者如何并存。

### 3.1 逻辑 Box / 边距 / 圆角

```text
核心保留：
- margin        → m
- padding       → p
- border-radius → bdrs
```

| MDN 属性                     | lego 缩写         | 示例类名       | 输出 CSS                           | 说明      |
| -------------------------- | --------------- | ---------- | -------------------------------- | ------- |
| `margin`                   | **`m` (核心)**    | `m10`      | `margin: 10px;`                  | 高频，保留极简 |
| `margin-block-start`       | `mabs`          | `mabs16`   | `margin-block-start: 16px;`      | 低频，自动生成 |
| `margin-inline`            | `mai`           | `mai10-20` | `margin-inline: 10px 20px;`      | 自动生成    |
| `padding`                  | **`p` (核心)**    | `p15`      | `padding: 15px;`                 | 高频，保留极简 |
| `padding-inline-end`       | `paie`          | `paie8`    | `padding-inline-end: 8px;`       | 自动生成    |
| `border-radius`            | **`bdrs` (核心)** | `bdrs8`    | `border-radius: 8px;`            | 高频，保留极简 |
| `border-inline-end-radius` | `boie`          | `boie6`    | `border-inline-end-radius: 6px;` | 自动生成    |

---

### 3.2 背景 / 边框 / 混合模式

```text
核心保留：
- background-color → bgc
- border-color     → bc
- border           → bd
```

| MDN 属性                | lego 缩写        | 示例类名                         | 输出 CSS                                       | 说明   |
| --------------------- | -------------- | ---------------------------- | -------------------------------------------- | ---- |
| `background-color`    | **`bgc` (核心)** | `bgc#f00`                    | `background-color: #f00;`                    | 高频短名 |
| `background-clip`     | `bac`          | `bac-padding-box`            | `background-clip: padding-box;`              | 自动生成 |
| `background-origin`   | `bao`          | `bao-content-box`            | `background-origin: content-box;`            | 自动生成 |
| `border`              | **`bd` (核心)**  | `bd[1 solid #000]`           | `border: 1px solid #000;`                    | 高频短名 |
| `border-image-source` | `bois`         | `bois[url(/img/border.png)]` | `border-image-source: url(/img/border.png);` | 自动生成 |
| `border-color`        | **`bc` (核心)**  | `bc#f00`                     | `border-color: #f00;`                        | 高频短名 |
| `mix-blend-mode`      | `mibm`         | `mibm-screen`                | `mix-blend-mode: screen;`                    | 自动生成 |

---

### 3.3 文本 / 字体高级属性

```text
核心保留：
- font-size   → fs
- font-weight → fw
- line-height → lh
- text-align  → ta
- text-shadow → ts
```

| MDN 属性                      | lego 缩写       | 示例类名                 | 输出 CSS                                 | 说明   |
| --------------------------- | ------------- | -------------------- | -------------------------------------- | ---- |
| `font-size`                 | **`fs` (核心)** | `fs16`               | `font-size: 16px;`                     | 高频短名 |
| `font-weight`               | **`fw` (核心)** | `fw700`              | `font-weight: 700;`                    | 高频短名 |
| `line-height`               | **`lh` (核心)** | `lh1.5`              | `line-height: 1.5;`                    | 高频短名 |
| `text-align`                | **`ta` (核心)** | `ta-center`          | `text-align: center;`                  | 高频短名 |
| `text-decoration-thickness` | `tedt`        | `tedt2px`            | `text-decoration-thickness: 2px;`      | 自动生成 |
| `text-decoration-style`     | `teds`        | `teds-dotted`        | `text-decoration-style: dotted;`       | 自动生成 |
| `text-underline-offset`     | `teuo`        | `teuo4px`            | `text-underline-offset: 4px;`          | 自动生成 |
| `font-kerning`              | `fok`         | `fok-normal`         | `font-kerning: normal;`                | 自动生成 |
| `font-variant-ligatures`    | `fovl`        | `fovl-normal`        | `font-variant-ligatures: normal;`      | 自动生成 |
| `font-variant-caps`         | `fovc`        | `fovc-small-caps`    | `font-variant-caps: small-caps;`       | 自动生成 |
| `font-variation-settings`   | `fovs`        | `fovs[\"wght\" 500]` | `font-variation-settings: "wght" 500;` | 自动生成 |
| `text-shadow`               | **`ts` (核心)** | `ts[1 2 3 #000]`     | `text-shadow: 1px 2px 3px #000;`       | 高频短名 |

---

### 3.4 Flex / Grid / Place 系列

```text
核心保留：
- display:flex       → d-flex
- justify-content    → jc
- align-items        → ai
- align-content      → ac
```

| MDN 属性                | lego 缩写       | 示例类名                    | 输出 CSS                              |
| --------------------- | ------------- | ----------------------- | ----------------------------------- |
| `display`             | **`d` (核心)**  | `d-flex`                | `display: flex;`                    |
| `justify-content`     | **`jc` (核心)** | `jc-center`             | `justify-content: center;`          |
| `align-items`         | **`ai` (核心)** | `ai-center`             | `align-items: center;`              |
| `align-content`       | **`ac` (核心)** | `ac-space-between`      | `align-content: space-between;`     |
| `flex-basis`          | `flb`         | `flb0`                  | `flex-basis: 0;`                    |
| `flex-grow`           | `flg`         | `flg1`                  | `flex-grow: 1;`                     |
| `flex-shrink`         | `fls`         | `fls0`                  | `flex-shrink: 0;`                   |
| `place-items`         | `pli`         | `pli-center`            | `place-items: center;`              |
| `place-content`       | `plc`         | `plc-space-between`     | `place-content: space-between;`     |
| `grid-auto-flow`      | `graf`        | `graf-row`              | `grid-auto-flow: row;`              |
| `grid-template-areas` | `grta`        | `grta[\"'a a' 'b c'\"]` | `grid-template-areas: "a a" "b c";` |

---

### 3.5 滚动 / overscroll / contain / 容器查询

```text
核心保留：
- overflow → o-*
```

| MDN 属性                   | lego 缩写      | 示例类名               | 输出 CSS                                |
| ------------------------ | ------------ | ------------------ | ------------------------------------- |
| `overflow`               | **`o` (核心)** | `o-auto`           | `overflow: auto;`                     |
| `scroll-behavior`        | `scb`        | `scb-smooth`       | `scroll-behavior: smooth;`            |
| `scroll-snap-type`       | `scst`       | `scst-y-mandatory` | `scroll-snap-type: y mandatory;`      |
| `scroll-margin-block`    | `scmb`       | `scmb20`           | `scroll-margin-block: 20px;`          |
| `overflow-anchor`        | `ova`        | `ova-none`         | `overflow-anchor: none;`              |
| `overscroll-behavior-y`  | `ovby`       | `ovby-contain`     | `overscroll-behavior-y: contain;`     |
| `content-visibility`     | `cov`        | `cov-auto`         | `content-visibility: auto;`           |
| `contain-intrinsic-size` | `cois`       | `cois[auto 500px]` | `contain-intrinsic-size: auto 500px;` |
| `container-type`         | `cot`        | `cot-inline-size`  | `container-type: inline-size;`        |

---

### 3.6 Transform / Transition / Animation / 3D

```text
核心保留：
- transform → t[...]
```

| MDN 属性                       | lego 缩写 | 示例类名                  | 输出 CSS                                     |
| ---------------------------- | ------- | --------------------- | ------------------------------------------ |
| `transform`                  | **`t`** | `t[translateY(-2px)]` | `transform: translateY(-2px);`             |
| `transform-origin`           | `tro`   | `tro[center center]`  | `transform-origin: center center;`         |
| `transform-box`              | `trb`   | `trb-border-box`      | `transform-box: border-box;`               |
| `transition-timing-function` | `trtf`  | `trtf-ease-in-out`    | `transition-timing-function: ease-in-out;` |
| `animation-delay`            | `and`   | `and200ms`            | `animation-delay: 200ms;`                  |
| `animation-timing-function`  | `antf`  | `antf-linear`         | `animation-timing-function: linear;`       |
| `perspective-origin`         | `peo`   | `peo[50% 50%]`        | `perspective-origin: 50% 50%;`             |
| `backface-visibility`        | `bav`   | `bav-hidden`          | `backface-visibility: hidden;`             |

---

### 3.7 UI / 媒体 / 滚动条 / 光标颜色

```text
核心保留：
- user-select  → uss-*（建议）
- caret-color  → cac*
- accent-color → acc*
```

| MDN 属性            | lego 缩写 | 示例类名              | 输出 CSS                         |
| ----------------- | ------- | ----------------- | ------------------------------ |
| `pointer-events`  | `poe`   | `poe-none`        | `pointer-events: none;`        |
| `user-select`     | `uss`   | `uss-none`        | `user-select: none;`           |
| `caret-color`     | `cac`   | `cac#ff00ff`      | `caret-color: #ff00ff;`        |
| `accent-color`    | `acc`   | `acc#6200ee`      | `accent-color: #6200ee;`       |
| `scrollbar-color` | `scc`   | `scc[#fff #888]`  | `scrollbar-color: #fff #888;`  |
| `scrollbar-width` | `scw`   | `scw-thin`        | `scrollbar-width: thin;`       |
| `object-fit`      | `obf`   | `obf-cover`       | `object-fit: cover;`           |
| `object-position` | `obp`   | `obp[center top]` | `object-position: center top;` |
| `image-rendering` | `imr`   | `imr-pixelated`   | `image-rendering: pixelated;`  |
| `backdrop-filter` | `baf`   | `baf[blur(10px)]` | `backdrop-filter: blur(10px);` |

---

### 3.8 v0.2 补充的核心 / 推荐缩写（基于 MDN 高频）

| 分类 | MDN 属性 | lego 缩写 | 示例类名 | 备注 / 冲突说明 |
| ---- | -------- | --------- | -------- | ---------------- |
| 布局与尺寸 | `aspect-ratio` | `ar` | `ar[16/9]` | 高频且直观，短于自动 `asr`；晋升核心 |
| 布局与尺寸 | `inline-size` / `block-size` | （自动：`ins` / `bls`） | `ins100%` | 保留自动缩写即可，文档列出便于查找 |
| 交互 | `user-select` | `uss` | `uss-none` | 晋升核心，文本不可选常用 |
| 交互 | `pointer-events` | `poe` | `poe-none` | 晋升核心，禁用点击常用 |
| 交互 | `touch-action` | `tac` | `tac-none` | 避免与 `ta`(text-align) 混淆，手写别名 |
| 交互 | `appearance` | `apr` | `apr-none` | 表单重置常用，避免与 `:active` 记忆混淆 |
| 背景与混合 | `background-clip` / `background-origin` | `bac` / `bao` | `bac-padding-box` | 推荐写入核心示例，直观于自动缩写 |
| 背景与混合 | `mix-blend-mode` | `mibm` | `mibm-screen` | 保持 Appendix 缩写，标注在核心表中 |
| 字体与文本 | `text-indent` | `ti` | `ti2em` | 晋升核心，排版常用 |
| 字体与文本 | `text-overflow` | `to` | `to-ellipsis` | 晋升核心，溢出省略常用 |
| 字体与文本 | `text-wrap` | `twp` | `twp-balance` | 避开伪类缩写 `tw:`(`:target-within`)；新属性需注明兼容性 |
| 字体与文本 | `tab-size` | `tbs` | `tbs4` | 避开 `ts`(text-shadow) 冲突 |
| 字体与文本 | `hyphens` | `hy` | `hy-auto` | 断词控制常用，短于自动 `hy`（一致但在此晋升） |
| 滚动与容器 | `scroll-behavior` | `scb` | `scb-smooth` | 晋升核心，页面平滑滚动常用 |
| 滚动与容器 | `scroll-snap-type` | `scst` | `scst-y-mandatory` | 晋升核心，吸附滚动常用 |
| 滚动与容器 | `overscroll-behavior` (`-x`/`-y`) | `ovb` / `ovbx` / `ovby` | `ovb-contain` | 推荐显式列出，避免忘记自动缩写 |
| 滚动与容器 | `scrollbar-color` / `scrollbar-width` | `scc` / `scw` | `scc[#fff #888]` | 晋升核心，注意浏览器兼容性 |
| 滚动与容器 | `content-visibility` | `cov` | `cov-auto` | 晋升核心，性能优化常用 |
| 滚动与容器 | `contain` / `contain-intrinsic-size` | `con` / `cois` | `con-layout` / `cois[auto 500px]` | 现代布局常用，`cois` 保持自动缩写 |
| 滚动与容器 | `container-type` / `container-name` | `cot` / `conm` | `cot-inline-size` | 容器查询常用，写入核心示例 |
| 3D / 动画 | `transform-origin` / `transform-box` | `tro` / `trb` | `tro[center center]` | 强调常用，建议视为核心别名 |
| 3D / 动画 | `backface-visibility` | `bav` | `bav-hidden` | 在 3D 翻转中常用，晋升核心 |
| 3D / 动画 | `will-change` | `wc` | `wc-transform` | 手写别名，提醒慎用、避免性能风险 |
| 轮廓 | `outline-offset` | `olo` | `olo2px` | 配合 `ol[...]` 常用，避免忘记自动缩写 |

---

## 4. 使用建议

1. **永远优先使用核心缩写**

   * 对于 `margin`、`padding`、`bgc`、`fs`、`fw`、`lh`、`ta`、`d-flex`、`jc`、`ai` 等高频属性，请直接用核心短缩写。

2. **当属性不在核心表时，再使用自动缩写**

   * 比如用 `cov-auto` 设置 `content-visibility:auto`，用 `cois[...]` 设置 `contain-intrinsic-size`。

3. **新增属性的命名策略**

   * 若 MDN 新增的属性在你的项目中是「高频」，可以把自动缩写提升为核心缩写，写入主规范；
   * 否则直接按本附录的自动算法使用即可。

通过这套机制，lego.css 同时满足：

* 高频属性有极简缩写，键盘 & token 成本低；
* 低频长尾属性仍然有统一、可推导的命名方式；
* 不需要为每个 CSS 属性手写一行映射表，维护成本可控。
