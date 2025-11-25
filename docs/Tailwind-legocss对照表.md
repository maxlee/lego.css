先提醒一句：下面这些 lego.css 写法有一部分是**你现在官网已经存在的语法**（比如 `m10`、`bgc#f00`、`h:(...)`）([lego.css][1])，有一部分是按这套设计**自然延伸出来的“建议写法”**，你可以当成“目标 DSL”，后面实现时再微调。

我按“场景”来整理对照表，每条都附一句：为什么这种写法对 LLM 更稳定。

---

## 1. 任意值 / 精确尺寸

Tailwind 的强项之一是 arbitrary value（`w-[327px]`），但这也是 LLM 最容易搞出团队不想要的东西的地方。([CSDN 博客][2])

### 1.1 固定宽度：`w-[327px]`

| 场景         | Tailwind（LLM 常产出） | lego.css 建议写法                                         | 对 LLM 更稳定的原因                                                                                        |
| ---------- | ----------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 固定宽度 327px | `w-[327px]`       | `w327` 或 `s327`（只宽：`w327`；宽高一起：`s327`）([lego.css][1]) | lego 的规则：**数字默认就是 px**，不用记 `[]` 语法，也不用担心被 ESLint 的 no-arbitrary-value 禁掉。模型只要记住“`w`+数字=width px”即可。 |

> 你也可以允许 `w327px` 这种写法，但从 LLM 角度讲，**统一“数字=px”** 最省脑。

---

### 1.2 百分比 / 视口单位：`w-full` / `h-screen`

| 场景      | Tailwind   | lego.css                | 稳定性说明                                                        |
| ------- | ---------- | ----------------------- | ------------------------------------------------------------ |
| 100% 宽度 | `w-full`   | `w100%`([lego.css][1])  | Tailwind 的 `full` 是框架特有关键字；lego 直接用纯 CSS 值 `%`，模型可以机械翻译 CSS。 |
| 全屏高度    | `h-screen` | `h100vh`([lego.css][1]) | 同理，`screen` 是 Tailwind 的概念；lego 用 `vh`，不依赖任何 config / 语义映射。  |

---

## 2. 颜色 / 主题 token

Tailwind 的 `bg-blue-500` / `bg-primary-50` 强依赖 theme 配置； arbitrary 颜色用 `bg-[#ff5252]` 形式。([Gist][3])

lego.css 已经有：`c#f00`、`bgc#97c430`、`cred`、`bgcwhite` 之类写法([lego.css][1])，非常适合 LLM 直接生成。

### 2.1 常见“语义色 + 阶数”：`bg-blue-500`

| 场景       | Tailwind      | lego.css 建议                         | 稳定性说明                                                                                                                 |
| -------- | ------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 默认蓝色按钮背景 | `bg-blue-500` | 直接用真实色值：`bgc#3b82f6` 或 `bgc#2196f3` | `blue-500` 是 **Tailwind config 里的抽象 token**；每个项目定义都不一样。LLM 生成 `bg-blue-500` 很可能和实际 theme 不匹配。lego 直接用 CSS 色值，不依赖项目配置。 |

> 如果你将来要支持设计 token，可以设计 `bgc@primary` 这种语法，让 LLM 在“知道有 token”的场景下用 `@primary`，否则 fallback 到 `#rrggbb` —— 这比 “primary-500” 这种二段式命名好很多。

---

### 2.2 arbitrary 颜色：`bg-[#ff5252]`

| 场景       | Tailwind       | lego.css                    | 稳定性说明                                                                                                          |
| -------- | -------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 任意十六进制背景 | `bg-[#ff5252]` | `bgc#ff5252`([lego.css][1]) | Tailwind 用 `[]` 包 arbitrary 值，这是个“特殊模式”，且很多团队用 ESLint 禁它([CSDN 博客][2])。lego 把这种写法当**主流路径**，语法简单统一：`bgc + 颜色值`。 |

---

### 2.3 变量驱动颜色：`bg-${color}-500`

这是 LLM 特别爱写的一种：把 `color` 当 `'blue' | 'red'` 之类 token，再拼 Tailwind 类名。

| 场景    | Tailwind（LLM 常见）                                   | lego.css 推荐模式                                                                                                         | 稳定性说明                                                                                                                                                                              |
| ----- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 动态主题色 | ``ts\nclassName={`bg-${color}-500 text-white`}\n`` | 让变量直接变成 CSS 颜色，拼 lego：``ts\nclassName={`bgc${color} c#fff`}\n`` 其中 `color` 可以是 `'#ff5252'` 或 `'red'`，而不是 `'blue-500'` | Tailwind JIT **看不到** `bg-${color}-500` 这种动态类，根本不会生成 CSS([Tailwind CSS][4])。lego 的解析在浏览器/构建时对“最终字符串”起作用，只要渲染出来是 `bgc#ff5252` 就一定生效。对 LLM 来说，直接把变量值当 CSS 值，而不是 Tailwind token，闭环更简单。 |

---

## 3. 伪类 / 交互状态

Tailwind：`hover:bg-sky-700`、`focus:bg-blue-500`、`focus-visible:bg-primary-50` 等，在文档中属于“状态修饰符（variants）”([Tailwind CSS][5])。
lego.css 现有：`h:bgc#f00`、`h:(c#fff p10)`、`a:c#0ff`、`f:fs-italic`([lego.css][1])。

### 3.1 简单 hover：`hover:bg-blue-500`

| 场景         | Tailwind            | lego.css                                         | 稳定性说明                                                                                                                |
| ---------- | ------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| hover 背景变蓝 | `hover:bg-blue-500` | `h:bgc#3b82f6` 或 `h:(bgc#3b82f6)`([lego.css][1]) | Tailwind 的 `hover:` 语法对 LLM 来说很好学，但依赖 `blue-500` 的 theme；lego 整体设计是“伪类 + 标准 CSS 值”，模型只需两步：**加前缀 `h:`，把颜色翻译为 CSS 值**。 |

### 3.2 聚焦态：`focus:bg-blue-500`

| 场景         | Tailwind            | lego.css                                         | 稳定性说明                                                                    |
| ---------- | ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| focus 背景变蓝 | `focus:bg-blue-500` | `f:bgc#3b82f6` 或 `f:(bgc#3b82f6)`([lego.css][1]) | 保持完全一致的前缀风格：Tailwind `focus:` → lego `f:`，简化 LLM 心智模型：**伪类都是一位缩写 + 冒号**。 |

### 3.3 `focus-visible:bg-primary-50`

lego 现在没内建 `focus-visible` 的缩写，但你可以按同样规则设计 `fv:` 这样的前缀（这是我对 DSL 的建议）。

| 场景                | Tailwind                      | lego.css 建议 DSL                                              | 稳定性说明                                                                                                                                                    |
| ----------------- | ----------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| focus-visible 改背景 | `focus-visible:bg-primary-50` | 建议引入：`fv:bgc#ffecec` 或 `fv:(bgc#ffecec bd[1 solid #ff5252])` | Tailwind 的 `focus-visible:` 语法本身很好懂，但依旧依赖 theme token。lego 如果统一定义：`fv:` 映射到 `:focus-visible`，LLM 学习成本极低：所有伪类都是同一模式（`h:`/`a:`/`f:`/`fv:`…），同时不受 theme 限制。 |

> 如果你短期不想加 `:focus-visible`，可以把 LLM 规范写死成：**把 Tailwind 的 `focus-visible:` 降级成 lego 的 `f:`**，但从长远看，我建议你真加一个 `fv:`。

---

### 3.4 复合状态：`hover:bg-blue-600 hover:text-white`

Tailwind 常见写法：

```html
<button class="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
```

lego.css 对照：

```html
<button class="
  bgc#3b82f6 c#fff
  h:(bgc#2563eb c#fff)
">
```

**为什么对 LLM 更稳：**

* Tailwind 要重复写两次 `hover:`（`hover:bg-...` + `hover:text-...`）；
* lego 有 group 语法 `h:(...)`，整体结构更规则（`状态修饰符 + 括号 + 一组原子`），非常适合模型做“模式化输出”。

---

## 4. 布局 / Flex 组合

这里是 LLM 很常生成的一类：居中布局、flex 列表等。

lego 官网已经给了 flex 示例：`d-flex jc-center ai-center h100vh bgc#f0f0f0`([lego.css][1])。

### 4.1 全屏居中卡片

Tailwind 常见写法（LLM 很爱写）：

```html
<div class="flex items-center justify-center h-screen bg-gray-100">
  <div class="px-6 py-4 bg-white rounded-lg shadow-md">
    内容
  </div>
</div>
```

lego.css 对照：

```html
<div class="d-flex ai-center jc-center h100vh bgc#f0f0f0">
  <div class="p10-20 bgc#fff bd[1 solid #ddd] bdrs8">
    内容
  </div>
</div>
```

**对 LLM 更稳的点：**

* Tailwind：`flex items-center justify-center h-screen bg-gray-100` 里，`items-center`、`justify-center` 都是**专有命名**；
* lego：`d-flex ai-center jc-center h100vh` 完全是 **缩写 + CSS 语义** 映射，模型可以从“CSS 属性 → 缩写”的角度学，而不是死记 `items-center` 这类词；
* `bdrs8` vs `rounded-lg`：前者是“统一规则：前缀 + 数字 px”，后者是 Tailwind 定义的一堆离散 token（`sm | md | lg | xl ...`）。

---

## 5. Button 组件的完整例子

这类片段是 LLM 生成 UI 时的高频：按钮 + hover 状态。

### Tailwind 版本（典型 LLM 产出）

```html
<button
  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md focus-visible:outline-none"
>
  Save
</button>
```

### lego.css 版本（对照）

```html
<button
  class="
    p8-16 bgc#3b82f6 c#fff
    bdrs4 bd[1 solid #3b82f6] c-pointer
    h:(bgc#2563eb bd[1 solid #2563eb] t[translateY(-2px)])
    fv:ol[2 solid #3b82f6]
  "
>
  Save
</button>
```

* `p8-16` = `padding: 8px 16px`；
* `bgc#3b82f6` / `bgc#2563eb`：模型可以直接把设计稿里的颜色贴过来；
* `h:(...)`：一组 hover 样式；
* `fv:ol[2 solid #3b82f6]`：建议的 `focus-visible` 写法（对应 `focus-visible:outline-*`）。

**对 LLM 的好处总结：**

1. **语法模式高度一致**：

   * 属性前缀基本都是两三个字母：`bgc`、`bdrs`、`jc`、`ai`；
   * 状态前缀单字母/双字母：`h:`、`f:`、`a:`、`fv:`。
     模型可以学“模式”，不用记大量特殊单词（`justify-center`、`rounded-md`…）。

2. **所有值都是“标准 CSS 值”或“简单数字”**：

   * 不再有 `blue-500`、`gray-100` 这种“必须查 config 的 token”；
   * 任意 px/颜色都不用特殊语法（不像 `w-[327px]` 这种 extra 结构）。

3. **不依赖扫描 / config，任何合法 token 一定生效**：

   * `bg-${color}-500` 在 Tailwind JIT 下非常不稳，lego 模型只要保证最后渲染的是 `bgc#xxxxxx` 或 `bgc<named>`，就没这种坑。

---

## 6. 给你自己的总结建议（产品视角）

如果你要把这份对照表变成“产品设计输入”，我会建议你内部写成类似下面两条设计原则：

1. **任何从 Tailwind 映射来的写法，都可以用一个简单的机械函数 transform 成 lego**

   * 例：`hover:bg-blue-500` → `h:bgc#3b82f6`
   * 例：`w-[327px]` → `w327`
   * 例：`bg-${color}-500` → `bgc${color}`（要求 `color` 本身就是 CSS 值）。

2. **所有属性 / 状态前缀都收敛在一个很小的、稳定的缩写集合里**

   * 这让你后面可以给 LLM 一个“映射表 + 少量示例”，而不是一整本 Tailwind 文档。

---

如果你接下来想更进一步，我可以直接帮你写一个**“伪代码转换器”**草案，比如：

```ts
// 输入 Tailwind 类字符串，输出 lego.css 类字符串（尽量 best-effort）
tailwindToLego("flex items-center justify-center h-screen bg-blue-500 hover:bg-blue-600")
  // -> "d-flex ai-center jc-center h100vh bgc#3b82f6 h:bgc#2563eb"
```

你可以用这个去验证：**lego 的 DSL 是否足够规则到可以“机械转换”**，这其实就是对 LLM 友好性的反证。

[1]: https://legocss.dev/ "lego.css - 像乐高积木一样写CSS | 原子化CSS框架"
[2]: https://blog.csdn.net/gitblog_01130/article/details/148943200?utm_source=chatgpt.com "彻底禁止Tailwind任意值：no-arbitrary-value规则全解析"
[3]: https://gist.github.com/t-mart/ee3684eff4064bab9cbe99890fc0e23c?utm_source=chatgpt.com "Tailwind v4 Syntax Cheatsheet · GitHub"
[4]: https://tailwind.nodejs.cn/docs/hover-focus-and-other-states?utm_source=chatgpt.com "悬停、聚焦和其他状态 - 核心概念 - Tailwind CSS 中文网"
[5]: https://tailwindcss.com/docs/hover-focus-and-other-states?utm_source=chatgpt.com "Hover, focus, and other states - Core concepts - Tailwind CSS"
