/*!
 * lego.css runtime CDN build
 * - window.lego 全局
 * - <style type="text/lego"> 支持
 * - MutationObserver 自动监听 DOM/class 变更
 * - 无模块依赖，直接 <script src="..."></script> 即可
 */
(function () {
  'use strict';

  // -----------------------------
  // 1. 核心缩写表（高频属性）
  // -----------------------------

  var CORE_ABBR = {
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
    "in": { numericType: "lengthList", properties: ["inset"] },
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
  var EXTRA_ABBR = Object.create(null);
  var AUTO_PROP_TO_ABBR = Object.create(null); // propertyName -> abbr
  var AUTO_ABBR = Object.create(null);         // abbr -> { properties: [...] };

  // 核心属性 -> 缩写 映射（从 CORE_ABBR 自动反推）
  var CORE_PROP_TO_ABBR = Object.create(null);
  (function buildCorePropMap() {
    for (var abbr in CORE_ABBR) {
      if (!Object.prototype.hasOwnProperty.call(CORE_ABBR, abbr)) continue;
      var meta = CORE_ABBR[abbr];
      if (meta.properties) {
        for (var i = 0; i < meta.properties.length; i++) {
          var prop = meta.properties[i];
          if (!CORE_PROP_TO_ABBR[prop]) CORE_PROP_TO_ABBR[prop] = abbr;
        }
      }
      if (meta.directions) {
        for (var key in meta.directions) {
          if (!Object.prototype.hasOwnProperty.call(meta.directions, key)) continue;
          var props = meta.directions[key];
          for (var j = 0; j < props.length; j++) {
            var p = props[j];
            if (!CORE_PROP_TO_ABBR[p]) CORE_PROP_TO_ABBR[p] = abbr;
          }
        }
      }
    }
  })();

  // -----------------------------
  // 2. 伪类 / 伪元素 前缀映射
  // -----------------------------

  var PSEUDO_MAP = {
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

  // 断点前缀：最常用的最小宽度媒体查询
  var BREAKPOINT_MAP = {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
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

  function camelToKebab(prop) {
    return String(prop).replace(/[A-Z]/g, function (m) {
      return "-" + m.toLowerCase();
    });
  }

  // 首词取2字母 + 后续词首字母，最长4位
  function generateInitialAbbr(canonicalProp) {
    var parts = canonicalProp.split("-").filter(Boolean);
    if (!parts.length) return "";
    var abbr = parts[0].slice(0, 2);
    for (var i = 1; i < parts.length; i++) {
      var p = parts[i];
      if (p && p[0]) abbr += p[0];
    }
    if (abbr.length > 4) abbr = abbr.slice(0, 4);
    return abbr;
  }

  function resolveAbbrCollision(initialAbbr, canonicalProp) {
    var abbr = initialAbbr;
    var used = new Set(
      []
        .concat(Object.keys(CORE_ABBR))
        .concat(Object.keys(AUTO_ABBR))
        .concat(Object.keys(EXTRA_ABBR))
    );

    if (!used.has(abbr)) return abbr;

    var existing = AUTO_ABBR[abbr];
    if (existing && existing.properties && existing.properties.indexOf(canonicalProp) >= 0) {
      return abbr;
    }

    var base =
      initialAbbr ||
      canonicalProp.replace(/[^a-z]/g, "").slice(0, 2) ||
      "p";
    var letters = canonicalProp.replace(/[^a-z]/g, "") || base;

    for (var i2 = base.length; i2 < letters.length; i2++) {
      var candidate = (base + letters[i2]).slice(0, 4);
      if (!used.has(candidate)) return candidate;
    }

    var suffix = 2;
    while (used.has((base + suffix).slice(0, 4))) {
      suffix++;
      if (suffix > 99) break;
    }
    return (base + suffix).slice(0, 4);
  }

  function getOrCreateAbbrForProperty(propertyName, options) {
    if (options === void 0) options = {};
    var canonical = canonicalizePropertyName(propertyName);

    if (CORE_PROP_TO_ABBR[canonical]) {
      return { abbr: CORE_PROP_TO_ABBR[canonical], source: "core" };
    }
    if (AUTO_PROP_TO_ABBR[canonical]) {
      return { abbr: AUTO_PROP_TO_ABBR[canonical], source: "auto" };
    }

    var initial = generateInitialAbbr(canonical);
    var abbr = resolveAbbrCollision(initial, canonical);

    AUTO_PROP_TO_ABBR[canonical] = abbr;

    var meta = { properties: [canonical] };
    if (options.numericType) meta.numericType = options.numericType;
    if (options.directions) meta.directions = options.directions;

    AUTO_ABBR[abbr] = { properties: [canonical] };
    EXTRA_ABBR[abbr] = meta;

    return { abbr: abbr, source: "auto" };
  }

  function autoAbbr(propertyName, options) {
    var canonical = canonicalizePropertyName(propertyName);
    var existed =
      !!CORE_PROP_TO_ABBR[canonical] || !!AUTO_PROP_TO_ABBR[canonical];
    var abbr = getOrCreateAbbrForProperty(propertyName, options).abbr;
    if (!existed) {
      invalidateCache();
    }
    return abbr;
  }

  // -----------------------------
  // 4. 解析 & 编译工具
  // -----------------------------

  function getAbbrMeta(abbr) {
    return CORE_ABBR[abbr] || EXTRA_ABBR[abbr] || null;
  }

  // class 字符串分词：保留 [] / () 内的空格
  function tokenizeClassString(str) {
    var tokens = [];
    var current = "";
    var bracketDepth = 0;
    var parenDepth = 0;

    for (var i = 0; i < str.length; i++) {
      var ch = str[i];

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

      var isSpace =
        ch === " " ||
        ch === "\t" ||
        ch === "\n" ||
        ch === "\r" ||
        ch === "\f";

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
    var important = false;
    var raw = token;
    if (raw.endsWith("!")) {
      important = true;
      raw = raw.slice(0, -1);
    }
    var segments = raw.split(":");
    if (segments.length === 1) {
      return { core: raw, variants: [], important: important };
    }
    var core = segments[segments.length - 1];
    var prefixSegments = segments.slice(0, -1);
    var variants = prefixSegments.map(function (seg) {
      if (BREAKPOINT_MAP[seg]) {
        return { type: "breakpoint", value: BREAKPOINT_MAP[seg] };
      }
      var pseudo = PSEUDO_MAP[seg];
      if (pseudo) return { type: "pseudo", value: pseudo };
      return { type: "unknown", value: seg };
    });
    return { core: core, variants: variants, important: important };
  }

  // 解析 group 语法：h:(bgc#f00 c#fff p10)
  function expandGroupToken(token) {
    var firstParen = token.indexOf("(");
    var lastParen = token.lastIndexOf(")");
    if (firstParen === -1 || lastParen <= firstParen || lastParen !== token.length - 1) {
      return [token];
    }
    var prefix = token.slice(0, firstParen); // e.g. "h:"
    var inner = token.slice(firstParen + 1, lastParen);
    if (!prefix.endsWith(":")) return [token];

    var innerTokens = tokenizeClassString(inner);
    if (!innerTokens.length) return [];

    return innerTokens.map(function (innerToken) {
      return prefix + innerToken;
    });
  }

  // 从 letters 中往前截，找到已知 abbr，剩余是方向后缀
  function resolveAbbrAndDir(letters) {
    for (var i = letters.length; i > 0; i--) {
      var candidate = letters.slice(0, i);
      if (getAbbrMeta(candidate)) {
        var dir = letters.slice(i);
        return { abbr: candidate, dir: dir };
      }
    }
    throw new Error('Unknown abbreviation prefix "' + letters + '"');
  }

  function getPropertiesFor(abbr, dir) {
    var meta = getAbbrMeta(abbr);
    if (!meta) throw new Error('Unknown abbreviation "' + abbr + '"');
    if (meta.directions) {
      var key = dir || "";
      var props = meta.directions[key];
      if (!props) {
        throw new Error('Direction "' + dir + '" not allowed for "' + abbr + '"');
      }
      return props;
    }
    return meta.properties || [];
  }

  // 将 "10" / "10px" / "50%" / "1.5rem" → 合法 CSS 长度（默认 px）
  function toLength(part) {
    var raw = part.trim();
    var m = raw.match(/^(-?\d*\.?\d+)([a-z%]+)?$/i);
    if (!m) return raw; // 比如 "auto" / "calc(...)"
    var num = m[1];
    var unit = m[2];
    if (!unit) return num + "px";
    return num + unit;
  }

  function buildNumericDeclarations(node) {
    var meta = getAbbrMeta(node.abbr);
    if (!meta) throw new Error('Unknown abbreviation "' + node.abbr + '"');
    var props = getPropertiesFor(node.abbr, node.dir);
    var decls = [];

    switch (meta.numericType) {
      case "lengthList": {
        var parts = node.numeric
          .split("-")
          .map(function (p) { return p.trim(); })
          .filter(Boolean);
        var value = parts.map(toLength).join(" ");
        for (var i = 0; i < props.length; i++) {
          decls.push([props[i], value]);
        }
        break;
      }
      case "length": {
        var value2 = toLength(node.numeric);
        for (var j = 0; j < props.length; j++) {
          decls.push([props[j], value2]);
        }
        break;
      }
      case "int": {
        var value3 = String(parseInt(node.numeric.trim(), 10));
        for (var k = 0; k < props.length; k++) {
          decls.push([props[k], value3]);
        }
        break;
      }
      case "number": {
        var value4 = node.numeric.trim();
        for (var l = 0; l < props.length; l++) {
          decls.push([props[l], value4]);
        }
        break;
      }
      case "numberOrLength": {
        var raw = node.numeric.trim();
        var value5 = /[a-z%]/i.test(raw) ? raw : raw;
        for (var m = 0; m < props.length; m++) {
          decls.push([props[m], value5]);
        }
        break;
      }
      default:
        throw new Error(
          'Unsupported numericType "' + meta.numericType + '" for "' + node.abbr + '"'
        );
    }
    return decls;
  }

  function parseCoreToken(core) {
    // 1) raw 方括号形式：abbr[...]
    var bracketMatch = core.match(/^([a-z]+)\[(.+)\]$/);
    if (bracketMatch) {
      var abbr = bracketMatch[1];
      var rawVal = bracketMatch[2];
      if (!getAbbrMeta(abbr)) {
        throw new Error('Unknown abbreviation "' + abbr + '" in "' + core + '"');
      }
      return { abbr: abbr, dir: "", kind: "raw", raw: rawVal };
    }

    // 2) 颜色 / 其它字面量：abbr#...
    var hexMatch = core.match(/^([a-z]+)(#.+)$/);
    if (hexMatch) {
      var abbr2 = hexMatch[1];
      var raw2 = hexMatch[2];
      if (!getAbbrMeta(abbr2)) {
        throw new Error('Unknown abbreviation "' + abbr2 + '" in "' + core + '"');
      }
      return { abbr: abbr2, dir: "", kind: "raw", raw: raw2 };
    }

    // 3) 数值形式：letters + digit...
    var numMatch = core.match(/^([a-z]+)([0-9].*)$/);
    if (numMatch) {
      var letters = numMatch[1];
      var rest = numMatch[2];
      var res = resolveAbbrAndDir(letters);
      var ab = res.abbr;
      var dir = res.dir;
      var meta = getAbbrMeta(ab);
      if (!meta || !meta.numericType) {
        throw new Error(
          'Abbreviation "' + ab + '" does not support numeric values in "' + core + '"'
        );
      }
      return { abbr: ab, dir: dir, kind: "numeric", numeric: rest };
    }

    // 4) 关键字形式：abbr-keyword
    var kwMatch = core.match(/^([a-z]+)-(.*)$/);
    if (kwMatch) {
      var abbr3 = kwMatch[1];
      var keyword = kwMatch[2];
      if (!getAbbrMeta(abbr3)) {
        throw new Error('Unknown abbreviation "' + abbr3 + '" in "' + core + '"');
      }
      return { abbr: abbr3, dir: "", kind: "keyword", keyword: keyword };
    }

    throw new Error('Cannot parse core token "' + core + '"');
  }

  function buildDeclarations(coreNode) {
    if (coreNode.kind === "numeric") {
      return buildNumericDeclarations(coreNode);
    }
    var props = getPropertiesFor(coreNode.abbr, coreNode.dir);
    if (coreNode.kind === "keyword") {
      var value = coreNode.keyword;
      return props.map(function (prop) { return [prop, value]; });
    }
    if (coreNode.kind === "raw") {
      var value2 = coreNode.raw;
      return props.map(function (prop) { return [prop, value2]; });
    }
    throw new Error('Unknown core node kind "' + coreNode.kind + '"');
  }

  function parseToken(token) {
    var parsed = parsePseudoPrefixesAndImportant(token);
    var core = parsed.core;
    var variants = parsed.variants;
    var important = parsed.important;
    var coreNode = parseCoreToken(core);
    var declarations = buildDeclarations(coreNode);
    return { token: token, variants: variants, important: important, declarations: declarations };
  }

  function escapeCssString(str) {
    return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function renderRule(ast, options) {
    if (options === void 0) options = {};
    var selectorStrategy = options.selectorStrategy || "attr";

    var baseSelector =
      selectorStrategy === "attr"
        ? '[class~="' + escapeCssString(ast.token) + '"]'
        : "." +
          ast.token.replace(/[^_a-zA-Z0-9-]/g, function (s) {
            return "\\" + s.charCodeAt(0).toString(16) + " ";
          });

    var pseudoSuffix = ast.variants
      .filter(function (v) { return v.type === "pseudo"; })
      .map(function (v) { return v.value; })
      .join("");

    var selector = baseSelector + pseudoSuffix;
    var breakpoints = ast.variants
      .filter(function (v) { return v.type === "breakpoint"; })
      .map(function (v) { return v.value; });
    var body = ast.declarations
      .map(function (_a) {
        var prop = _a[0], value = _a[1];
        return (
          prop +
          ":" +
          value +
          (ast.important ? " !important" : "") +
          ";"
        );
      })
      .join("");

    var rule = selector + "{" + body + "}";

    if (!breakpoints.length) return rule;

    // 多个断点时按前缀顺序嵌套媒体查询
    for (var i = breakpoints.length - 1; i >= 0; i--) {
      rule = "@media " + breakpoints[i] + "{" + rule + "}";
    }
    return rule;
  }

  function compileClassList(classList, options) {
    var opts = options || {};
    var selectorStrategy = opts.selectorStrategy || "attr";

    // 确保 renderRule 拿到 selectorStrategy 的默认值，同时不破坏其他 options
    var renderOptions = {};
    for (var optKey in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, optKey)) {
        renderOptions[optKey] = opts[optKey];
      }
    }
    if (!renderOptions.selectorStrategy) {
      renderOptions.selectorStrategy = selectorStrategy;
    }

    var tokens;
    if (Array.isArray(classList)) {
      tokens = [];
      for (var i = 0; i < classList.length; i++) {
        var parts = tokenizeClassString(String(classList[i] || ""));
        tokens.push.apply(tokens, parts);
      }
    } else {
      tokens = tokenizeClassString(String(classList || ""));
    }

    // 展开 group token：h:(bgc#f00 c#fff p10)
    var flattened = [];
    for (var j = 0; j < tokens.length; j++) {
      var t = tokens[j];
      if (!t) continue;
      var expanded = expandGroupToken(t);
      flattened.push.apply(flattened, expanded);
    }

    var seen = new Set();
    var rules = [];
    var currentVersion = cacheVersion;
    var cacheKeyPrefix = selectorStrategy + "::";

    for (var k = 0; k < flattened.length; k++) {
      var token = flattened[k];
      if (!token) continue;
      if (seen.has(token)) continue;
      seen.add(token);
      var cacheKey = cacheKeyPrefix + token;
      var cached = tokenCache[cacheKey];
      if (cached && cached.version === currentVersion) {
        rules.push(cached.css);
        continue;
      }
      try {
        var ast = parseToken(token);
        var css = renderRule(ast, renderOptions);
        tokenCache[cacheKey] = { css: css, version: currentVersion };
        rules.push(css);
      } catch (err) {
        if (renderOptions.debug && typeof console !== "undefined" && console.warn) {
          console.warn('[lego] skip invalid token "' + token + '": ' + (err && err.message));
        }
      }
    }

    return rules.join("\n");
  }

  // -----------------------------
  // 6. 浏览器端 runtime & 自启动
  // -----------------------------

  var observer = null;
  var pendingRefresh = false;
  var scheduledRoot = null;
  var lastInjectedCss = "";
  var tokenCache = Object.create(null);
  var cacheVersion = 0;
  var compiledClasses = new Set();
  var compiledCss = "";
  var cacheHydrated = false;
  var lastSelectorStrategy = null;
  var autoAbbrBootstrapped = false;

  function resetCompiledState() {
    compiledClasses = new Set();
    compiledCss = "";
    lastInjectedCss = "";
    cacheHydrated = false;
  }

  function invalidateCache() {
    cacheVersion++;
    tokenCache = Object.create(null);
    resetCompiledState();
  }

  function bootstrapAutoAbbrFromStyle() {
    if (autoAbbrBootstrapped) return;
    if (typeof document === "undefined") return;
    var style = document.createElement("div").style;
    if (!style) return;
    autoAbbrBootstrapped = true;
    var seen = new Set();
    var proto = style;
    for (var prop in proto) {
      if (!prop) continue;
      if (!isNaN(prop)) continue;
      var v = proto[prop];
      if (typeof v === "function") continue;
      if (prop === "length" || prop === "parentRule" || prop === "cssText") continue;
      var kebab = camelToKebab(prop);
      if (/^webkit/i.test(prop)) {
        kebab = "-" + kebab;
      }
      var canonical = canonicalizePropertyName(kebab);
      if (!canonical || seen.has(canonical)) continue;
      seen.add(canonical);
      try {
        autoAbbr(canonical, { numericType: "numberOrLength" });
      } catch (_e) {
        // ignore properties that cannot be registered
      }
    }
  }

  function ensureStyleElement(id) {
    if (id === void 0) id = "lego-style";
    if (typeof document === "undefined") return null;
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    return el;
  }

  function scheduleRefresh(root) {
    if (root === void 0 && typeof document !== "undefined") {
      root = document.documentElement;
    }
    if (!root) return;
    scheduledRoot = root;
    if (pendingRefresh) return;
    pendingRefresh = true;

    var raf = typeof window !== "undefined" && window.requestAnimationFrame;
    if (raf) {
      raf.call(window, flushRefresh);
    } else {
      setTimeout(flushRefresh, 16);
    }

    function flushRefresh() {
      pendingRefresh = false;
      applyLegoFromRoot(scheduledRoot);
    }
  }

  var CACHE_PREFIX = "lego-css-cache::";
  var CACHE_VERSION = "v1";

  function safeLocalStorage() {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      var ls = window.localStorage;
      var probe = "__lego_cache_probe__";
      ls.setItem(probe, "1");
      ls.removeItem(probe);
      return ls;
    } catch (_err) {
      return null;
    }
  }

  function hashTokens(tokens) {
    var sorted = tokens.slice().sort();
    var str = sorted.join("|");
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return (hash >>> 0).toString(16);
  }

  function getCacheKey(tokens, selectorStrategy) {
    var hash = hashTokens(tokens);
    return {
      key: CACHE_PREFIX + CACHE_VERSION + "::" + selectorStrategy + "::" + hash,
      hash: hash,
    };
  }

  function loadCache(cacheKey, debug) {
    var ls = safeLocalStorage();
    if (!ls || !cacheKey) return null;
    try {
      var raw = ls.getItem(cacheKey.key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== CACHE_VERSION) return null;
      return parsed;
    } catch (err) {
      if (debug && typeof console !== "undefined" && console.warn) {
        console.warn("[lego] cache load failed", err);
      }
      return null;
    }
  }

  function saveCache(cacheKey, payload, debug) {
    var ls = safeLocalStorage();
    if (!ls || !cacheKey) return;
    try {
      ls.setItem(
        cacheKey.key,
        JSON.stringify({
          version: CACHE_VERSION,
          selectorStrategy: payload.selectorStrategy,
          classes: payload.classes,
          css: payload.css,
        })
      );
    } catch (err) {
      if (debug && typeof console !== "undefined" && console.warn) {
        console.warn("[lego] cache save failed", err);
      }
    }
  }

  function flattenClassTokens(classTokens) {
    var flattened = [];
    for (var i = 0; i < classTokens.length; i++) {
      var t = classTokens[i];
      if (!t) continue;
      var expanded = expandGroupToken(t);
      flattened.push.apply(flattened, expanded);
    }
    return flattened;
  }

  // 合并所有 <style type="text/lego"> / text/legocss 的内容
  function getExtraLegoStyles() {
    if (typeof document === "undefined") return "";
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll('style[type="text/lego"],style[type="text/legocss"]')
    );
    var out = "";
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].textContent) {
        out += "\n\n" + nodes[i].textContent;
      }
    }
    return out;
  }

  // lego 全局配置
  var defaultConfig = {
    selectorStrategy: "attr",
    observeMutations: true,
    persistCache: true,
    debug: false,
  };

  function getLegoGlobal() {
    if (typeof window === "undefined") return { config: defaultConfig };
    if (!window.lego) window.lego = {};
    if (!window.lego.config) window.lego.config = {};
    return window.lego;
  }

  function getConfig() {
    var lego = getLegoGlobal();
    var cfg = {};
    for (var k in defaultConfig) {
      if (Object.prototype.hasOwnProperty.call(defaultConfig, k)) {
        cfg[k] = defaultConfig[k];
      }
    }
    var userCfg = lego.config || {};
    for (var k2 in userCfg) {
      if (Object.prototype.hasOwnProperty.call(userCfg, k2)) {
        cfg[k2] = userCfg[k2];
      }
    }
    return cfg;
  }

  function applyLegoFromRoot(root) {
    if (root === void 0 && typeof document !== "undefined") {
      root = document.documentElement;
    }
    if (!root || typeof document === "undefined") return;

    bootstrapAutoAbbrFromStyle();

    var cfg = getConfig();
    if (lastSelectorStrategy && lastSelectorStrategy !== cfg.selectorStrategy) {
      resetCompiledState();
    }
    lastSelectorStrategy = cfg.selectorStrategy;

    var classes = new Set();

    var nodes = root.querySelectorAll("[class]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var classAttr = String(el.className || "");
      var toks = tokenizeClassString(classAttr);
      for (var j = 0; j < toks.length; j++) {
        var c = toks[j];
        if (c) classes.add(c);
      }
    }

    var flattened = flattenClassTokens(Array.from(classes));
    var uniqueTokens = [];
    var uniqueSet = new Set();
    for (var k = 0; k < flattened.length; k++) {
      var token = flattened[k];
      if (!token) continue;
      if (uniqueSet.has(token)) continue;
      uniqueSet.add(token);
      uniqueTokens.push(token);
    }

    var cacheKey = null;
    if (cfg.persistCache && !cacheHydrated) {
      cacheKey = getCacheKey(uniqueTokens, cfg.selectorStrategy);
      var cached = loadCache(cacheKey, cfg.debug);
      if (cached && cached.css) {
        compiledCss = cached.css || "";
        compiledClasses = new Set(cached.classes || []);
        cacheHydrated = true;
        lastInjectedCss = ""; // force inject to sync DOM
        if (cfg.debug && typeof console !== "undefined" && console.info) {
          console.info(
            "[lego] cache hit: ",
            compiledClasses.size,
            "classes, selector:",
            cfg.selectorStrategy
          );
        }
      }
    }

    var newTokens = [];
    for (var m = 0; m < uniqueTokens.length; m++) {
      var t = uniqueTokens[m];
      if (!compiledClasses.has(t)) {
        compiledClasses.add(t);
        newTokens.push(t);
      }
    }

    if (newTokens.length) {
      var css = compileClassList(newTokens, {
        selectorStrategy: cfg.selectorStrategy,
        debug: cfg.debug,
      });
      if (css) {
        if (compiledCss) compiledCss += "\n";
        compiledCss += css;
      }
    }

    var styleEl = ensureStyleElement();
    if (styleEl) {
      var mergedCss = compiledCss + getExtraLegoStyles();
      if (mergedCss !== lastInjectedCss) {
        lastInjectedCss = mergedCss;
        styleEl.textContent = mergedCss;
      }
    }

    if (cfg.persistCache) {
      cacheKey = cacheKey || getCacheKey(uniqueTokens, cfg.selectorStrategy);
      saveCache(
        cacheKey,
        {
          selectorStrategy: cfg.selectorStrategy,
          classes: Array.from(compiledClasses),
          css: compiledCss,
        },
        cfg.debug
      );
    }

    if (cfg.observeMutations && typeof MutationObserver !== "undefined") {
      setupMutationObserver(root, cfg);
    }
  }

  function setupMutationObserver(root, cfg) {
    if (observer) return;
    observer = new MutationObserver(function (mutations) {
      var styleEl = typeof document !== "undefined"
        ? document.getElementById("lego-style")
        : null;

      var shouldRecompute = false;
      for (var i = 0; i < mutations.length; i++) {
        var target = mutations[i].target;

        // 忽略内部 style 元素的变更，避免 textContent 更新触发死循环
        if (
          styleEl &&
          (target === styleEl ||
            (typeof styleEl.contains === "function" && styleEl.contains(target)))
        ) {
          continue;
        }

        shouldRecompute = true;
        break;
      }

      if (!shouldRecompute) return;

      if (cfg.debug) {
        console.log("[lego] DOM mutated, recomputing styles");
      }
      scheduleRefresh(root);
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // -----------------------------
  // 7. 暴露到 window.lego
  // -----------------------------

  if (typeof window !== "undefined") {
    var lego = getLegoGlobal();
    lego.config = lego.config || {};

    // 暴露 API
    lego.refresh = function () {
      if (typeof document === "undefined") return;
      applyLegoFromRoot(document.documentElement);
    };
    lego.compile = function (classList, options) {
      return compileClassList(classList, options);
    };
    lego.registerAbbr = function (name, meta) {
      if (
        (CORE_ABBR[name] || EXTRA_ABBR[name]) &&
        typeof console !== "undefined" &&
        console.warn
      ) {
        console.warn('[lego] abbreviation "' + name + '" already exists, overriding.');
      }
      EXTRA_ABBR[name] = meta;
      invalidateCache();
    };
    lego.autoAbbr = autoAbbr;
  }

  // -----------------------------
  // 8. 自启动：DOM Ready 后自动扫描
  // -----------------------------

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    var run = function () {
      applyLegoFromRoot(document.documentElement);
    };
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }
  }
})();
