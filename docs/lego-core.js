// lego-core.js
// lego.css v0.1 核心实现：
// - 核心缩写表（高频属性）
// - 自动命名算法（属性 -> 缩写）
// - token 解析 / CSS 生成
// - group 语法 / 颜色字面量 / 多值
// - 浏览器环境自动扫描并注入 CSS

// -----------------------------
// 1. 核心缩写表（高频属性）
// -----------------------------

export const CORE_ABBR = {
  // ---- Box & spacing ----
  m: {
    numericType: "lengthList",
    directions: {
      "": ["margin"],
      t: ["margin-top"],
      r: ["margin-right"],
      b: ["margin-bottom"],
      l: ["margin-left"],
      x: ["margin-left", "margin-right"],
      y: ["margin-top", "margin-bottom"],
    },
  },
  p: {
    numericType: "lengthList",
    directions: {
      "": ["padding"],
      t: ["padding-top"],
      r: ["padding-right"],
      b: ["padding-bottom"],
      l: ["padding-left"],
      x: ["padding-left", "padding-right"],
      y: ["padding-top", "padding-bottom"],
    },
  },
  w: { numericType: "length", properties: ["width"] },
  h: { numericType: "length", properties: ["height"] },
  s: { numericType: "length", properties: ["width", "height"] },
  mw: { numericType: "length", properties: ["max-width"] },
  mh: { numericType: "length", properties: ["max-height"] },
  nw: { numericType: "length", properties: ["min-width"] },
  nh: { numericType: "length", properties: ["min-height"] },
  bs: { properties: ["box-sizing"] },

  // ---- Layout & positioning ----
  d: { properties: ["display"] },
  pos: { properties: ["position"] },
  t: { numericType: "length", properties: ["top"] },
  r: { numericType: "length", properties: ["right"] },
  b: { numericType: "length", properties: ["bottom"] },
  l: { numericType: "length", properties: ["left"] },
  in: { numericType: "lengthList", properties: ["inset"] },
  fl: { properties: ["float"] },
  cl: { properties: ["clear"] },
  zi: { numericType: "int", properties: ["z-index"] },
  o: { properties: ["overflow"] },
  ox: { properties: ["overflow-x"] },
  oy: { properties: ["overflow-y"] },
  v: { properties: ["visibility"] },
  op: { numericType: "number", properties: ["opacity"] },
  cur: { properties: ["cursor"] },
  gp: { numericType: "length", properties: ["gap"] },
  rg: { numericType: "length", properties: ["row-gap"] },
  cg: { numericType: "length", properties: ["column-gap"] },

  // ---- Color & background ----
  c: { properties: ["color"] },
  bgc: { properties: ["background-color"] },
  bg: { properties: ["background"] },
  bgi: { properties: ["background-image"] },
  cac: { properties: ["caret-color"] },
  acc: { properties: ["accent-color"] },

  // ---- Border / outline / shadow ----
  bd: {
    directions: {
      "": ["border"],
      t: ["border-top"],
      r: ["border-right"],
      b: ["border-bottom"],
      l: ["border-left"],
    },
  },
  bw: { numericType: "length", properties: ["border-width"] },
  bds: { properties: ["border-style"] },
  bc: { properties: ["border-color"] },
  bdrs: { numericType: "length", properties: ["border-radius"] },
  ol: { properties: ["outline"] },
  bsh: { properties: ["box-shadow"] },
  ts: { properties: ["text-shadow"] },

  // ---- Typography & text ----
  fs: { numericType: "length", properties: ["font-size"] },
  fw: { numericType: "int", properties: ["font-weight"] },
  ff: { properties: ["font-family"] },
  fst: { properties: ["font-style"] },
  lh: { numericType: "numberOrLength", properties: ["line-height"] },
  ls: { numericType: "length", properties: ["letter-spacing"] },
  ta: { properties: ["text-align"] },
  tt: { properties: ["text-transform"] },
  td: { properties: ["text-decoration"] },
  tdl: { properties: ["text-decoration-line"] },
  tds: { properties: ["text-decoration-style"] },
  tdc: { properties: ["text-decoration-color"] },
  ws: { properties: ["white-space"] },
  wb: { properties: ["word-break"] },
  ow: { properties: ["overflow-wrap"] },
  wm: { properties: ["writing-mode"] },
  to: { properties: ["text-overflow"] },

  // ---- Flex / grid / place ----
  fxd: { properties: ["flex-direction"] },
  fxw: { properties: ["flex-wrap"] },
  fx: { properties: ["flex"] },
  jc: { properties: ["justify-content"] },
  ai: { properties: ["align-items"] },
  ac: { properties: ["align-content"] },
  as: { properties: ["align-self"] },
  ord: { numericType: "int", properties: ["order"] },
  pi: { properties: ["place-items"] },
  pc: { properties: ["place-content"] },
  ps: { properties: ["place-self"] },

  gtc: { properties: ["grid-template-columns"] },
  gtr: { properties: ["grid-template-rows"] },
  gta: { properties: ["grid-template-areas"] },
  gc: { properties: ["grid-column"] },
  gr: { properties: ["grid-row"] },
  gaf: { properties: ["grid-auto-flow"] },

  // ---- Transform / transition / animation / filter ----
  tf: { properties: ["transform"] },
  tr: { properties: ["transition"] },
  trd: { numericType: "length", properties: ["transition-duration"] },
  trp: { properties: ["transition-property"] },
  trtf: { properties: ["transition-timing-function"] },
  ani: { properties: ["animation"] },
  fil: { properties: ["filter"] },
  baf: { properties: ["backdrop-filter"] },

  // ---- UI / media / misc ----
  poe: { properties: ["pointer-events"] },
  uss: { properties: ["user-select"] },
  obf: { properties: ["object-fit"] },
  obp: { properties: ["object-position"] },
  imr: { properties: ["image-rendering"] },
  scc: { properties: ["scrollbar-color"] },
  scw: { properties: ["scrollbar-width"] },
};

// 动态注册的缩写（自动命名算法用）
const EXTRA_ABBR = Object.create(null);
const AUTO_PROP_TO_ABBR = Object.create(null); // propertyName -> abbr
const AUTO_ABBR = Object.create(null); // abbr -> { properties: [...] }

// 核心属性 -> 缩写 映射（从 CORE_ABBR 自动反推）
const CORE_PROP_TO_ABBR = Object.create(null);

for (const [abbr, meta] of Object.entries(CORE_ABBR)) {
  if (meta.properties) {
    for (const prop of meta.properties) {
      if (!CORE_PROP_TO_ABBR[prop]) CORE_PROP_TO_ABBR[prop] = abbr;
    }
  }
  if (meta.directions) {
    for (const props of Object.values(meta.directions)) {
      for (const prop of props) {
        if (!CORE_PROP_TO_ABBR[prop]) CORE_PROP_TO_ABBR[prop] = abbr;
      }
    }
  }
}

// -----------------------------
// 2. 伪类 / 伪元素 前缀映射
// -----------------------------

const PSEUDO_MAP = {
  // 伪类
  h: ":hover",
  a: ":active",
  f: ":focus",
  fv: ":focus-visible",
  fw: ":focus-within",
  ch: ":checked",
  ds: ":disabled",
  em: ":empty",
  fc: ":first-child",
  lc: ":last-child",
  // 伪元素（e-* 前缀）
  "e-af": "::after",
  "e-bf": "::before",
  "e-ph": "::placeholder",
  "e-sel": "::selection",
  "e-mr": "::marker",
  "e-fl": "::first-letter",
  "e-f1": "::first-line",
  "e-fsb": "::file-selector-button",
};

// -----------------------------
// 3. 自动命名算法（property -> abbr）
// -----------------------------

function stripVendorPrefix(prop) {
  return prop.replace(/^-(webkit|moz|ms|o)-/i, "");
}

function canonicalizePropertyName(prop) {
  return stripVendorPrefix(String(prop).trim().toLowerCase());
}

// 首词取2字母 + 后续词首字母，最长4位
function generateInitialAbbr(canonicalProp) {
  const parts = canonicalProp.split("-").filter(Boolean);
  if (!parts.length) return "";
  let abbr = parts[0].slice(0, 2);
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    if (p && p[0]) abbr += p[0];
  }
  if (abbr.length > 4) abbr = abbr.slice(0, 4);
  return abbr;
}

function resolveAbbrCollision(initialAbbr, canonicalProp) {
  let abbr = initialAbbr;
  const used = new Set([
    ...Object.keys(CORE_ABBR),
    ...Object.keys(AUTO_ABBR),
    ...Object.keys(EXTRA_ABBR),
  ]);

  if (!used.has(abbr)) return abbr;

  const existing = AUTO_ABBR[abbr];
  if (
    existing &&
    existing.properties &&
    existing.properties.includes(canonicalProp)
  ) {
    return abbr;
  }

  const base =
    initialAbbr || canonicalProp.replace(/[^a-z]/g, "").slice(0, 2) || "p";
  const letters = canonicalProp.replace(/[^a-z]/g, "") || base;

  for (let i = base.length; i < letters.length; i++) {
    const candidate = (base + letters[i]).slice(0, 4);
    if (!used.has(candidate)) return candidate;
  }

  let suffix = 2;
  while (used.has((base + suffix).slice(0, 4))) {
    suffix++;
    if (suffix > 99) break;
  }
  return (base + suffix).slice(0, 4);
}

/**
 * 为给定 CSS 属性获取 / 注册一个缩写。
 * - 若属性在 CORE_ABBR 中已有缩写，则返回 core 缩写；
 * - 否则使用自动命名算法生成 3~4 位缩写，写入 EXTRA_ABBR & AUTO_ABBR。
 */
export function getOrCreateAbbrForProperty(propertyName, options = {}) {
  const canonical = canonicalizePropertyName(propertyName);

  if (CORE_PROP_TO_ABBR[canonical]) {
    return { abbr: CORE_PROP_TO_ABBR[canonical], source: "core" };
  }
  if (AUTO_PROP_TO_ABBR[canonical]) {
    return { abbr: AUTO_PROP_TO_ABBR[canonical], source: "auto" };
  }

  const initial = generateInitialAbbr(canonical);
  const abbr = resolveAbbrCollision(initial, canonical);

  AUTO_PROP_TO_ABBR[canonical] = abbr;

  const meta = { properties: [canonical] };
  if (options.numericType) meta.numericType = options.numericType;
  if (options.directions) meta.directions = options.directions;

  AUTO_ABBR[abbr] = { properties: [canonical] };
  EXTRA_ABBR[abbr] = meta;

  return { abbr, source: "auto" };
}

export function autoAbbr(propertyName, options) {
  return getOrCreateAbbrForProperty(propertyName, options).abbr;
}

// -----------------------------
// 4. 解析 & 编译工具
// -----------------------------

function getAbbrMeta(abbr) {
  return CORE_ABBR[abbr] || EXTRA_ABBR[abbr] || null;
}

// class 字符串分词：保留 [] / () 内的空格
function tokenizeClassString(str) {
  const tokens = [];
  let current = "";
  let bracketDepth = 0;
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (ch === "[") {
      bracketDepth++;
      current += ch;
      continue;
    }
    if (ch === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      current += ch;
      continue;
    }
    if (ch === "(") {
      parenDepth++;
      current += ch;
      continue;
    }
    if (ch === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
      current += ch;
      continue;
    }

    const isSpace =
      ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\f";

    if (isSpace && bracketDepth === 0 && parenDepth === 0) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }

  if (current) tokens.push(current);
  return tokens.filter(Boolean);
}

// 解析前缀伪类 & !important
function parsePseudoPrefixesAndImportant(token) {
  let important = false;
  let raw = token;
  if (raw.endsWith("!")) {
    important = true;
    raw = raw.slice(0, -1);
  }
  const segments = raw.split(":");
  if (segments.length === 1) {
    return { core: raw, variants: [], important };
  }
  const core = segments[segments.length - 1];
  const prefixSegments = segments.slice(0, -1);
  const variants = prefixSegments.map((seg) => {
    const pseudo = PSEUDO_MAP[seg];
    if (pseudo) return { type: "pseudo", value: pseudo };
    return { type: "unknown", value: seg };
  });
  return { core, variants, important };
}

// 解析 group 语法：h:(bgc#f00 c#fff p10)
// 返回展开后的 token 列表
function expandGroupToken(token) {
  const firstParen = token.indexOf("(");
  const lastParen = token.lastIndexOf(")");
  if (firstParen === -1 || lastParen <= firstParen || lastParen !== token.length - 1) {
    return [token];
  }
  const prefix = token.slice(0, firstParen); // e.g. "h:"
  const inner = token.slice(firstParen + 1, lastParen);
  if (!prefix.endsWith(":")) return [token];

  const innerTokens = tokenizeClassString(inner);
  if (!innerTokens.length) return [];

  // 直接把 group 前缀拼回去： "h:" + "bgc#f00" => "h:bgc#f00"
  return innerTokens.map((innerToken) => prefix + innerToken);
}

// 在 letters 中从最长开始向前截，找到已知 abbr，剩下的是方向后缀
function resolveAbbrAndDir(letters) {
  for (let i = letters.length; i > 0; i--) {
    const candidate = letters.slice(0, i);
    if (getAbbrMeta(candidate)) {
      const dir = letters.slice(i);
      return { abbr: candidate, dir };
    }
  }
  throw new Error(`Unknown abbreviation prefix "${letters}"`);
}

function getPropertiesFor(abbr, dir) {
  const meta = getAbbrMeta(abbr);
  if (!meta) throw new Error(`Unknown abbreviation "${abbr}"`);
  if (meta.directions) {
    const key = dir || "";
    const props = meta.directions[key];
    if (!props) {
      throw new Error(`Direction "${dir}" not allowed for "${abbr}"`);
    }
    return props;
  }
  return meta.properties || [];
}

// 将 "10" / "10px" / "50%" / "1.5rem" → 合法 CSS 长度（默认 px）
function toLength(part) {
  const raw = part.trim();
  const m = raw.match(/^(-?\d*\.?\d+)([a-z%]+)?$/i);
  if (!m) return raw; // 比如 "auto" / "calc(...)"
  const num = m[1];
  const unit = m[2];
  if (!unit) return `${num}px`;
  return `${num}${unit}`;
}

function buildNumericDeclarations(node) {
  const meta = getAbbrMeta(node.abbr);
  if (!meta) throw new Error(`Unknown abbreviation "${node.abbr}"`);
  const props = getPropertiesFor(node.abbr, node.dir);
  const decls = [];

  switch (meta.numericType) {
    case "lengthList": {
      const parts = node.numeric
        .split("-")
        .map((p) => p.trim())
        .filter(Boolean);
      const value = parts.map(toLength).join(" ");
      for (const prop of props) {
        decls.push([prop, value]);
      }
      break;
    }
    case "length": {
      const value = toLength(node.numeric);
      for (const prop of props) {
        decls.push([prop, value]);
      }
      break;
    }
    case "int": {
      const value = String(parseInt(node.numeric.trim(), 10));
      for (const prop of props) {
        decls.push([prop, value]);
      }
      break;
    }
    case "number": {
      const value = node.numeric.trim();
      for (const prop of props) {
        decls.push([prop, value]);
      }
      break;
    }
    case "numberOrLength": {
      const raw = node.numeric.trim();
      const value = /[a-z%]/i.test(raw) ? raw : raw;
      for (const prop of props) {
        decls.push([prop, value]);
      }
      break;
    }
    default:
      throw new Error(
        `Unsupported numericType "${meta.numericType}" for "${node.abbr}"`
      );
  }
  return decls;
}

function parseCoreToken(core) {
  // 1) raw 方括号形式：abbr[...]
  const bracketMatch = core.match(/^([a-z]+)\[(.+)\]$/);
  if (bracketMatch) {
    const abbr = bracketMatch[1];
    const raw = bracketMatch[2];
    if (!getAbbrMeta(abbr)) {
      throw new Error(`Unknown abbreviation "${abbr}" in "${core}"`);
    }
    return { abbr, dir: "", kind: "raw", raw };
  }

  // 2) 颜色 / 其它字面量：abbr#...
  const hexMatch = core.match(/^([a-z]+)(#.+)$/);
  if (hexMatch) {
    const abbr = hexMatch[1];
    const raw = hexMatch[2]; // 比如 "#020617"
    if (!getAbbrMeta(abbr)) {
      throw new Error(`Unknown abbreviation "${abbr}" in "${core}"`);
    }
    return { abbr, dir: "", kind: "raw", raw };
  }

  // 3) 数值形式：letters + digit...
  const numMatch = core.match(/^([a-z]+)([0-9].*)$/);
  if (numMatch) {
    const letters = numMatch[1];
    const rest = numMatch[2];
    const { abbr, dir } = resolveAbbrAndDir(letters);
    const meta = getAbbrMeta(abbr);
    if (!meta || !meta.numericType) {
      throw new Error(
        `Abbreviation "${abbr}" does not support numeric values in "${core}"`
      );
    }
    return { abbr, dir, kind: "numeric", numeric: rest };
  }

  // 4) 关键字形式：abbr-keyword
  const kwMatch = core.match(/^([a-z]+)-(.*)$/);
  if (kwMatch) {
    const abbr = kwMatch[1];
    const keyword = kwMatch[2];
    if (!getAbbrMeta(abbr)) {
      throw new Error(`Unknown abbreviation "${abbr}" in "${core}"`);
    }
    return { abbr, dir: "", kind: "keyword", keyword };
  }

  throw new Error(`Cannot parse core token "${core}"`);
}

function buildDeclarations(coreNode) {
  if (coreNode.kind === "numeric") {
    return buildNumericDeclarations(coreNode);
  }
  const props = getPropertiesFor(coreNode.abbr, coreNode.dir);
  if (coreNode.kind === "keyword") {
    const value = coreNode.keyword;
    return props.map((prop) => [prop, value]);
  }
  if (coreNode.kind === "raw") {
    const value = coreNode.raw;
    return props.map((prop) => [prop, value]);
  }
  throw new Error(`Unknown core node kind "${coreNode.kind}"`);
}

// -----------------------------
// 5. 对外 API：解析 token & 渲染 CSS
// -----------------------------

/**
 * 解析单个 lego token → AST
 * 例如： "m10" / "h:bgc#f00" / "lh1.5!" 等
 */
export function parseToken(token) {
  const { core, variants, important } = parsePseudoPrefixesAndImportant(token);
  const coreNode = parseCoreToken(core);
  const declarations = buildDeclarations(coreNode);
  return { token, variants, important, declarations };
}

function escapeCssString(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * 将 AST 渲染成一条 CSS 规则
 *
 * selectorStrategy:
 *   - "attr" 默认，用 [class~="token"]，适配任意字符串 token
 *   - "class" 使用 .token（需要 token 是合法类名）
 */
export function renderRule(ast, { selectorStrategy = "attr" } = {}) {
  const baseSelector =
    selectorStrategy === "attr"
      ? `[class~="${escapeCssString(ast.token)}"]`
      : `.${ast.token.replace(
          /[^_a-zA-Z0-9-]/g,
          (s) => "\\" + s.charCodeAt(0).toString(16) + " "
        )}`;

  const pseudoSuffix = ast.variants
    .filter((v) => v.type === "pseudo")
    .map((v) => v.value)
    .join("");

  const selector = `${baseSelector}${pseudoSuffix}`;
  const body = ast.declarations
    .map(
      ([prop, value]) =>
        `${prop}:${value}${ast.important ? " !important" : ""};`
    )
    .join("");

  return `${selector}{${body}}`;
}

/**
 * 编译一串 class（或 class 数组）成 CSS 字符串
 */
export function compileClassList(classList, options) {
  let tokens;
  if (Array.isArray(classList)) {
    tokens = [];
    for (const item of classList) {
      const parts = tokenizeClassString(String(item || ""));
      tokens.push(...parts);
    }
  } else {
    tokens = tokenizeClassString(String(classList || ""));
  }

  // 展开 group token：h:(bgc#f00 c#fff p10)
  const flattened = [];
  for (const t of tokens) {
    if (!t) continue;
    const expanded = expandGroupToken(t);
    flattened.push(...expanded);
  }

  const seen = new Set();
  const rules = [];

  for (const token of flattened) {
    if (!token) continue;
    if (seen.has(token)) continue;
    seen.add(token);
    try {
      const ast = parseToken(token);
      const css = renderRule(ast, options);
      rules.push(css);
    } catch (err) {
      // 解析失败的 token 直接忽略
      // console.warn(err);
    }
  }

  return rules.join("\n");
}

// -----------------------------
// 6. 浏览器端 runtime 辅助 & 自启动
// -----------------------------

function ensureStyleElement(id = "lego-style") {
  if (typeof document === "undefined") return null;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  return el;
}

/**
 * 从给定 root（默认 document.documentElement）扫描 class，
 * 编译所有 lego token，注入到 <style id="lego-style"> 中。
 */
export function applyLegoFromRoot(
  root = typeof document !== "undefined" ? document.documentElement : null
) {
  if (!root || typeof document === "undefined") return;

  const classes = new Set();

  root.querySelectorAll("[class]").forEach((el) => {
    const classAttr = String(el.className || "");
    tokenizeClassString(classAttr).forEach((c) => c && classes.add(c));
  });

  const css = compileClassList(Array.from(classes));
  const styleEl = ensureStyleElement();
  if (styleEl) styleEl.textContent = css;
}

// 自启动：只要在浏览器里引入 lego-core.js，就会自动跑一次扫描
if (typeof window !== "undefined" && typeof document !== "undefined") {
  const run = () => applyLegoFromRoot();
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}
