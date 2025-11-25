行，那我们这次就别写“技术方案”，而是当成**产品 / 设计复盘**来干这件事。

> 目标：
> 把「Tailwind 在 LLM 场景下容易翻车的典型场景」列出来，
> 然后一条条对照：lego.css 应该用什么**机制级**设计去规避。

---

## 总览表

> 列 1：Tailwind + LLM 的失败模式
> 列 2：现实里的典型情况 / 信号
> 列 3：对 LLM 的具体坑点
> 列 4：lego.css 建议的解决策略

我先给表，再在下面挑几条展开。

---

### 表：Tailwind 在 LLM 场景的失败点 vs lego.css 对策

| # | Tailwind 在 LLM 场景的失败模式                              | 现实信号 / 案例                                                                                                                                                                                                | 对 LLM 的具体问题                                                                                                                                                                          | lego.css 对应策略（建议方向）                                                                                                                                                                                                                                          |                                                                                                                                                                                                              |
| - | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 | **模型很容易编造不存在的 utility（class does not exist）**       | 新手在 `@apply` 或直接写类时，经常遇到 “`w-50`/`hover:`/`focus-visible:bg-primary-50` class does not exist” 类型报错：要么写了不存在的尺寸（`w-50`），要么写错 variant 语法（`hover:`），要么使用了 theme 中根本没定义的色阶（`primary-50`）([Stack Overflow][1]) | LLM 没有你项目的 `tailwind.config`，会凭记忆造一些“合理但不存在”的类：`w-50`、`primary-50`、奇怪的 `ring-3.5` 等。对人类来说还能调试，对量产代码的 LLM 来说就是**静默失败**：class 存在，但不生效。                                                 | - **语法 = 紧贴 CSS 属性**：`w100` = `width:100px`，`bgc#ff5252` = `background-color:#ff5252`，尽量避免“依赖配置才能存在”的类名。<br>- 提供 **官方 JSON 规则表**（你上一轮已经有草案）：所有合法缩写都在表里，LLM 不需要猜。<br>- 规则设计成：**只要 token 符合 BNF，就一定能编译成 CSS**（哪怕只是 `width: 50px` 这种原始值），避免“合法字符串但语义缺失”这种坑。     |                                                                                                                                                                                                              |
| 2 | **动态类名 / 模板字符串与 JIT 扫描机制冲突**                        | 官方和社区反复强调：不能用 `text-${color}-600` 这种动态拼接，必须出现完整类名，否则 JIT / tree-shaking 扫描不到，就不会生成 CSS；StackOverflow 上大量问：动态 class 为啥没效果，答案基本都是“Tailwind 不支持这种动态构造，必须写出所有候选类名让扫描器看到”([Stack Overflow][2])                | LLM 写前端时**天然喜欢**用模板字符串、变量来组织 class，比如 `bg-${color}-500`、`text-${level}-xl`。在传统 CSS 没问题，但在 Tailwind 下直接导致构建后类消失 —— 对模型来说，这是一个“语义合理但框架黑魔法导致失效”的坑，很难从返回的 HTML 里诊断。                      | - lego.css **不走“预扫描→生成”这条路**：核心引擎按需解析 token，不靠扫描源码列表。<br>- 对浏览器 runtime：看到最终 class 字符串再解析即可，`className={\`bgc#${color}`}` 完全合法。<br>- 对构建时：可以做简单的正则 / token 抽取，但**不强制要求静态字面量**；即使提取不到，也可在运行时兜底。<br>- 设计目标：**“只要最终 class 字面量落到 DOM 上，就能生效”**，允许 LLM 自由使用模板字符串。 |                                                                                                                                                                                                              |
| 3 | **强配置耦合：类名是否存在依赖 tailwind.config**                  | 各种 “某类不存在 / focus-visible:bg-primary-50 不工作 / CLI 不生成所有类” 的问题，最后都指向：content 路径没配对、theme 没定义对应色阶、插件没启用等配置问题([tailwindcss.com][3])                                                                         | LLM 只能看到**一段组件代码**，看不到你的配置文件；它生成的是“默认 Tailwind 世界观下的类名”，和实际项目 config 不对齐就报错。每个仓库的 `primary`、spacing scale 都不一样，模型不可能为每个仓库适配。                                                         | - lego.css 默认设计成 **“零配置即可完整可用”**：所有常用属性、单位、长度在 DSL 内自洽，不依赖项目 config 才能成立。<br>- 设计“**可选 theme 层**”，用 JSON 描述 spacing / color tokens 给 LLM，作为**增强**而不是前置条件。<br>- 把“依赖 config 的值”（如设计系统 token）设计成**命名值**层：`bgc@primary` 映射到主题，而 `bgc#hex` 永远合法。                 |                                                                                                                                                                                                              |
| 4 | **任意值（arbitrary values）与团队规范冲突，LLM 又偏爱用它**          | Tailwind v3 任意值语法（`w-[327px]`、`bg-[hsl(...)]`）被官方和社区明确指出会带来维护问题，甚至专门有 ESLint 规则 `no-arbitrary-value` 来限制，原因包括破坏设计 token 一致性、生成大量无法复用的唯一规则等([CSDN 博客][4])                                                 | 对 LLM 来说，任意值是**最自然的输出方式**：直接把“14px 红色”翻译成 `w-[14px] bg-[#ff0000]` 就完事；但这**直接顶撞**团队 lint 规则 & 设计系统约束。结果是：模型输出通过了浏览器、通过了 Tailwind，却被 ESLint / code review 拦回去。                         | - lego.css 直接把**“任意值”作为标准路径**：`w100`、`bgc#ff0000` 天然合法，而不是一个“特殊语法”；<br>- 再在 config 里提供 `mode: 'free'                                                                                                                                                         | 'token-preferred'`：<br>  - free：任何数字 / 色值都行；<br>  - token-preferred：编译器会尝试把经常出现的值收敛到 tokens（甚至可提供 CLI 做“auto-fix”）。<br>- 官方 LLM 规范里可以建议：**优先用 token 名（如 `@primary`），否则 fallback 到原始值**，这样既不限制模型，又能给团队留下治理空间。 |
| 5 | **@apply / layer 语法复杂，LLM 很容易用错**                   | StackOverflow 上常见报错：“`w-50` class does not exist in @apply layer”、“`hover:` class does not exist”等，本质是 Tailwind 的 `@apply` 必须使用已经存在的 utility，语法里不能带伪类前缀，且必须在 `@layer` 中定义([Stack Overflow][1])           | LLM 在“看文档 + 模仿”模式下，特别容易：<br>- 把 `hover:bg-blue-500` 误写进 `@apply hover:bg-blue-500;`；<br>- 在 CSS 里发明新的 utility 再 `@apply`，结果直接构建失败。<br>这类错误人类一眼能看出，模型很难从报错信息中抽象出 Tailwind 的 layer 规则。 | - lego.css 直接**弱化 / 禁用 @apply 型用法**：鼓励“**把 lego 当最终 DSL**”，而不是再在 CSS 内做二次抽象。<br>- 如果必须支持 `@apply`，也保持语义极简：允许在 `.btn` 里 `@apply m10 bgc#f00`，但**严禁伪类 / 断点出现在 apply 内**，避免 LLM 去玩那些边缘 case。<br>- 文档里明确：**推荐 LLM 只输出 HTML + class，不去写 CSS 文件**，减少一个维度的错误空间。     |                                                                                                                                                                                                              |
| 6 | **环境 / 构建链复杂，用户难以“直接运行 LLM 产出的 Tailwind 页面”**       | OpenAI 社区有用户抱怨：让 GPT 生成了用 Tailwind 的页面，但本地看不到效果；按照提示安装 `tailwindcss postcss autoprefixer` 仍报错，不知道还差什么配置([OpenAI Developer Community][5])                                                                 | 对 LLM 工具来说，如果每次产出 Tailwind 页面都要用户：<br>- 搭 Node 环境；<br>- 写 `tailwind.config.js`；<br>- 配 PostCSS / CLI 构建…<br>实际门槛非常高。大部分“复制代码就能跑”的用户根本扛不住这梯子。                                         | - lego.css 提供**一份纯 CSS CDN 版本**：任何页面 `<link rel="stylesheet" href="...lego.css">` 即可使用基础 DSL（和你现在已经在做的方向一致）。<br>- 高级能力（按需 / runtime）再用 npm + 构建链，以插件形式存在；但**LLM 默认输出走 CDN 路径**，保证“复制即有效”。<br>- 在文档里给 LLM 一个非常简单的引入方式示例：用户只要照抄 `<link>` 和 class 就能看到效果。       |                                                                                                                                                                                                              |
| 7 | **需要专门为 LLM 写“长 prompt / llms.txt”来教它怎么用 Tailwind** | 已经有人专门写 `tailwind-llms` 仓库，提供一个针对 Tailwind v4 的大号 prompt 文件，指导 LLM 正确使用 Tailwind；DaisyUI 也提供 `llms.txt`，鼓励开发者把该文件放进项目，让 Copilot / Cursor 理解它的 DSL；还有别人给 Tailwind 文档生成 LLM 专用的精简文本([GitHub][6])           | 这说明：Tailwind 的语义足够复杂，以至于：<br>- 通用模型对它的掌握**不够稳定**；<br>- 需要额外“训练材料”让模型别乱用类名。<br>这对 lego.css 是直接的反向信号：**你的 DSL 如果也走这条路，就只是换皮 Tailwind，没任何价值。**                                          | - lego.css 从 v0 开始就提供**一份机器可读 JSON 规范**（你上一轮的 `lego-llm-schema`），内容尽量短小、形式规则。<br>- 目标：这份规范 + 若干示例足够让 LLM 掌握 80–90% 场景，**不需要额外几十 KB 的 prompt 文本。**<br>- 同时，结构设计成可以被工具直接消费（做 schema 验证、编辑器补全），而不是只能给人看的文档。                                                     |                                                                                                                                                                                                              |
| 8 | **类名汤（class soup）占用 token，上下文噪音大**                  | 很多文章承认 Tailwind 的代价之一就是 HTML 中 class 巨长，看起来像“类名汤”([Stack Overflow][2])；AI 友好文章也只是承认“单个元素 class 多，但总 CSS 更少”([Builder Design][7])                                                                         | 对 LLM 来说：每个 class 都是 token，`p-4 bg-white rounded-lg shadow-md text-gray-700 ...` 这一串会吃掉不少上下文，对长页面 / 大组件树来说，**token 压力会放大这一问题**；而且这些 token 很多是重复模式。                                   | - lego.css 本身就主打**短 token**（`m10`, `p20`, `bgc#fff`），还能加 group 语法（`h:(bgc#f00 c#fff)`），在表达同样信息时用更少 token。<br>- 语法设计时刻意压缩：统一单位规则、简化前缀，让 LLM 在保持表达力的前提下，用更短上下文表达样式。<br>- 将来甚至可以在 runtime 层支持“别名 / 压缩映射”，进一步减少 DOM 中类名长度。                                       |                                                                                                                                                                                                              |

---

## 再狠一点：lego.css **必须**抓死的三件事

上面是表格版本，下面是我给你的“硬指标版”，避免你后面设计飘了：

1. **任何合法 token 一定有 deterministic 的 CSS 结果，不依赖外部 config。**

   * 与 Tailwind 强耦合 `tailwind.config`、扫描路径、插件的方式对着干。
   * 这样 LLM 输出 `m10 bgc#ff5252` 时，你不用担心“这个项目有没有 `spacing.10` / `primary-500`”。

2. **不禁止动态构造，只要求最终字符串符合 BNF。**

   * 模型爱写模板字符串？随它，只要落到 DOM 的是 `m10` / `bgc#ff5252`，runtime / buildtime 都能解析。
   * 你通过“不靠扫描、而靠 token parser + 规则引擎”来获得这个属性。

3. **从 day 1 就提供 machine-first 的规范文件，而不是人类教程。**

   * Tailwind 已经有人专门做 `tailwind-llms.txt`、`daisyui llms.txt`、AI 版 Tailwind docs，这说明后补救非常麻烦。([GitHub][6])
   * lego.css 脑子要反过来：代码就是对 DSL 的唯一实现，JSON spec 是第一公民，文档只是 spec 的人类友好版。

---

如果你接下来想更“落地”一点，我可以下一步直接帮你写一个：

* **「Tailwind → lego.css 对照表」**：
  把常见 LLM 输出的 Tailwind 代码片段（比如 `bg-${color}-500`、`w-[327px]`、`focus-visible:bg-primary-50`）
  一条条翻译成对应的 lego.css 写法，并标注“这个转换为什么对 LLM 更稳定”。

[1]: https://stackoverflow.com/questions/78037660/class-does-not-exist-in-apply-layer-using-tailwind?utm_source=chatgpt.com "Class does not exist in @Apply layer using Tailwind"
[2]: https://stackoverflow.com/questions/68020378/how-to-use-template-literals-in-tailwindcss-to-change-classes-dynamically?utm_source=chatgpt.com "css - How to use template literals in tailwindcss to change classes ..."
[3]: https://tailwindcss.com/docs/adding-custom-styles?utm_source=chatgpt.com "Adding custom styles - Core concepts - Tailwind CSS"
[4]: https://blog.csdn.net/gitblog_01130/article/details/148943200?utm_source=chatgpt.com "彻底禁止Tailwind任意值：no-arbitrary-value规则全解析"
[5]: https://community.openai.com/t/having-issues-setting-up-tailwind-locally-to-view-code-produced-by-gpt/1358174?utm_source=chatgpt.com "Having issues setting up Tailwind locally to view code produced by GPT"
[6]: https://github.com/rgfx/tailwind-llms?utm_source=chatgpt.com "GitHub - rgfx/tailwind-llms"
[7]: https://builder.design/blog/tailwind-css-for-ai-generated-code?utm_source=chatgpt.com "为什么TailwindCss如此受AI欢迎？"
