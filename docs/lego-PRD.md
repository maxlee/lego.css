# lego.css 产品需求文档（PRD）

版本：0.1  
状态：Draft  
负责人：你自己（请写名字）  
文档目的：给产品、技术、AI Prompt 设计共用的“单一事实源”，描述 lego.css 是什么、解决什么问题、做到什么程度算完成。

---

## 1. 背景 & 问题

### 1.1 CSS & Atomic CSS 的现状

- 传统语义类（`.btn-primary`，`.card`）对人类友好，但：
  - 抽象层过高，样式 ↔ 结构耦合严重；
  - LLM 需要先“猜”语义，才能拼出对的类名。
- Utility-First / Atomic CSS（如 Tailwind、UnoCSS）已经成为前端主流方案之一：  
  - 通过“原子类组合”来完成 UI，而不是写大块 CSS 选择器。  

问题：现有方案都是 **“human-first”** 设计，对 LLM 不友好。

### 1.2 Tailwind / UnoCSS 在 LLM 场景的痛点

以 Tailwind / UnoCSS 为代表：

- **语义和配置强耦合**
  - `bg-blue-500`、`text-slate-500` 等 token 完全依赖项目配置，LLM 不知道“当前项目有没有这条色板”。  
- **JIT / 扫描式编译看不到动态字符串**
  - 典型写法：`className={"bg-" + color + "-500"}`，JIT 根本扫不出来这类动态类名，只能靠人类遵守“不要这么写”。  
- **任意值语法复杂、团队经常禁用**
  - Tailwind 的 `w-[327px]`、`bg-[#ff5252]` 属于“逃生舱”语法，不少团队通过 ESLint 规则直接禁用 arbitrary values。  
  - LLM 却非常爱用这种形式，导致生成代码和团队规范冲突。
- **规则分散在海量文档，LLM 很难构建稳定 mental model**
  - Tailwind 的 utility 设计是为了人类阅读体验优化，而不是为了 LLM 的可压缩规则集。
  - 社区才会出现专门的 `tailwind-llms.txt` 这类项目去“再包装一层”让 LLM 学。  

### 1.3 lego.css 想解决什么

**一句话定位：**  
> lego.css = 为 LLM & 人类共同设计的、零配置、完整覆盖 MDN CSS 的原子化 CSS DSL。

目标：

1. **LLM 一看就能机械翻译**：  
   - 从自然语言 → CSS 属性 → lego 缩写 → 类字符串，全流程可解释。
2. **不依赖项目 runtime 配置**：
   - 不需要 theme、design token 才能“存在”某个类名；
   - 任何合法 lego token 必须在默认环境下可以编译。
3. **理论上覆盖 CSS 全规范**：
   - 以 MDN CSS Reference 为全集（属性、伪类、伪元素）。  

---

## 2. 产品定位 & 目标用户

### 2.1 产品定位

- 不是「又一个 Tailwind」；
- 是 **“LLM-first 的 Atomic CSS 运行时 + DSL 规范”**：
  - 给 LLM 提供更稳定可控的 UI 生成语言；
  - 给前端团队提供一个“AI 友好”的 CSS 抽象层。

### 2.2 目标用户

1. **使用 LLM 生成前端代码的团队**
   - 内部用 ChatGPT / 自研大模型做“UI Co-pilot”；
   - 希望把模型生成出来的代码能直接进 CI / 代码库。
2. **搭建 / 低代码 / 原型工具**
   - 需要自动生成大量 UI 片段；
   - 希望语言规则简单、稳定、容易做静态分析。
3. **前端工程团队**
   - 习惯 Utility-first 思路；
   - 希望统一人手写的样式和模型输出的样式。

---

## 3. 核心价值 & 卖点

1. **LLM 友好的 DSL**
   - 命名规则极度规则化：属性缩写 + 数值 / 关键字 / `[]` 原生值。
   - 伪类前缀 (`h:` / `f:` / `fv:`…) 和伪元素前缀（`e-af:` / `e-ph:`…）有固定模式。
   - 自动命名算法可覆盖全 CSS 属性空间。

2. **零配置即可覆盖全部标准 CSS 属性**
   - 以 MDN CSS Reference 为“真相源”，不依赖 theme / preset。  

3. **运行时 + 构建时双模式**
   - LLM Demo / playground 场景 → 使用浏览器端 runtime，即写即用；
   - 正式工程 → 使用构建期插件（类似 UnoCSS on-demand 方案）。  

4. **配套 AI 文档（llms.txt / JSON 规范 / 示例）**
   - 内置 `llms.txt` / `llms-full.txt` 帮模型快速理解 DSL 结构。  
   - 提供 JSON spec & 对照表，方便在 prompt 中引用。

---

## 4. 需求范围（Scope）

### 4.1 P0：首版必须完成

**功能维度**

1. **DSL 核心规范**
   - 命名语法（token grammar）：
     - `状态前缀 + 属性缩写 + 值 + !` 这一套语法定死；
   - 命名空间：
     - 属性缩写 vs 伪类前缀 vs 伪元素前缀，不能互相抢单字母；
   - **核心缩写表**：
     - ~80–120 个高频属性有手工极简缩写（`m/p/w/h/s/bg c/fs/fw/lh/ta/d/jc/ai/ac/o/v/c/zi...`）；
   - **自动命名算法**：
     - 对所有未覆盖属性给出唯一缩写；  
     - 冲突时高频属性优先保留短名，低频属性使用较长缩写。

2. **运行时引擎（浏览器）**
   - 提供 `lego.runtime.js`：
     - 输入：一个 DOM / HTML 字符串；
     - 解析 class 中的 lego token，生成对应 CSS 规则；
     - 将规则注入到 `<style>` 中，支持增量更新；
   - 支持伪类前缀 & 伪元素前缀；
   - 支持 group 语法：`h:(bgc#f00 c#fff)`。

3. **构建时引擎（Node 环境）**
   - 提供 `@lego/core`：
     - `compileTokens(tokens[], options)` → CSS 字符串；
     - `scanFiles()`：扫描指定路径（支持 `.html/.jsx/.tsx/.vue` 简单模式）提取 token；
   - 提供一个 demo 级别的 Vite 插件（或者 CLI），实现简单 on-demand 生成 CSS。  

4. **LLM 规范输出**
   - `lego-naming-spec.md`（主规范）+ `appendix-auto-abbr.md`（自动缩写附录）；
   - `lego-naming-spec.json`（机器可读）；
   - `llms.txt` + `llms-full.txt`：
     - 参考 llms.txt 标准结构：分区列出 DSL、示例和关键文档。  

**体验维度**

- 官网 playground：
  - 左侧编辑 HTML with lego.css；
  - 右侧即时渲染；
  - 一键复制 CodePen / Codesandbox 链接。
- 文档：
  - 首页清楚写出“为 LLM 优化的 Atomic CSS”；
  - 提供几组“Tailwind → lego.css 对照表”。

### 4.2 P1：进阶功能

- 响应式前缀（如 `sm:` / `md:` / `lg:`）；
- 更多 CSS 模块覆盖：Grid 高阶用法、Scroll Snap、Container Queries；
- 更强的构建期集成：
  - 正式的 Vite / Webpack / esbuild 插件；
  - Watch mode & HMR 支持。

### 4.3 P2：生态 / 周边

- VSCode 插件：
  - 提示 + lint + hover 显示对应 CSS；
- 设计工具 / figma 插件；
- “lego UI Recipes”：
  - 一套典型组件（按钮、卡片、form、dialog 等）的官方推荐写法。

---

## 5. 非目标（Out of Scope）

短期内 **不做**：

1. 完整的 design token / theme 系统（那是另一个层的产品）。
2. 全平台 UI 方案（不考虑 React Native / RNW / Flutter）。
3. CSS-in-JS 替代方案（不做运行时 JS 动态注入 style 的复杂逻辑，只做“从类名到 CSS 声明”的映射）。

---

## 6. 用户故事 & 用例

### 6.1 LLM 代码生成

> 作为一个使用大模型生成前端代码的开发者，  
> 我希望模型输出的 className 是符合 lego.css 规范的，  
> 这样我可以直接在浏览器里引入 `lego.runtime.js` 或在构建时用 `@lego/core` 编译，而不用到处修类名。

验收标准：

- 给 LLM 一段说明 + 5–10 个示例后：
  - 80% 以上的生成 UI 代码类名在 lego 编译器里是合法的；
  - 绝大多数属性不再出现 Tailwind 的 `bg-blue-500`、`w-[327px]` 等形态。

### 6.2 前端团队统一规范

> 作为一个前端团队负责人，  
> 我希望不论是工程师手写 UI，还是模型生成 UI，都使用同一套 lego.css 原子类，  
> 这样我可以统一 review 标准和 lint 规则。

验收标准：

- eslint / stylelint 里只有一套约束 lego.css 的规则，而不需要对“模型输出”开 special case。

---

## 7. 成功指标（KPI）

- **LLM 使用层面**
  - 内部评测任务中，使用 lego.css 的生成 UI 成功率 ≥ 90%（相对于 Tailwind baseline）。
- **工程实践层面**
  - 一个中等规模 demo（10+ 页面）中，lego.css runtime 首包 < 10kb gzip，构建产出 CSS < 30kb；
- **社区层面**
  - GitHub star / npm 周下载暂时不设硬指标，先看能不能在 AI / 前端圈形成“LLM 友好 CSS DSL”的认知。

---

## 8. 里程碑

MVP（P0 全部完成）：

- DSL 规范 v0.1
- Runtime 初版（浏览器）
- Core 库 `@lego/core`
- 简单 Vite 插件
- 官网 + playground
- llms.txt / JSON 规范

之后视反馈迭代 P1 / P2 功能。
