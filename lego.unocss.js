// lego.unocss.js
import { propertyMap } from './src/rules/propertyMap.js'
import { otherRules } from './src/rules/otherRules.js'
import { borderRules } from './src/rules/borderRules.js'
import { textDecorationRules } from './src/rules/textDecorationRules.js'

import { parseBorder } from './src/parse/parse-border.js'
import { parseTextShadow } from './src/parse/parse-text-shadow.js'
import { transformerVariantGroup } from './src/parse/transformer-variant-group.js'

const unitRegexPart = "px|em|rem|vh|vw|%|svh|lvh|svw|lvw|dvw|svi|lvi|dvb";

// 单独处理margin/padding属性值的函数
/**
 * @param {String} values 属性值
 * @param {String} defaultUnit 默认单位
 * @param {String} property 属性名
 * @returns {Object} CSS属性值对象
 */
function parseBoxModelValues(values, defaultUnit, property) {
    // 使用正则表达式直接匹配数字及其后跟的可选单位，同时支持"|"和"-"作为分隔符
    const parts = values.split(/[\|-]/).map(part => {
        const match = part.match(/(\d+)(px|em|rem|vh|vw|%)?/);
        // 如果匹配成功，则使用捕获的数字和单位（如果未指定单位，则使用默认单位）
        if (match) {
            const [, num, unit = defaultUnit] = match; // 使用解构赋值简化变量赋值
            return `${num}${unit}`;
        }
        return '';
    }).filter(Boolean).join(' '); // 使用filter(Boolean)移除空字符串，然后用空格连接各部分

    return { [property]: parts };
}

// 定义一个函数来生成基于属性映射的规则
/**
 * @param {Object} map 属性映射
 * @param {String} defaultUnit 默认单位
 * @returns {Array} 规则数组
 */
function getRules(map, defaultUnit = 'px') {
    const rules = [];
    const noDefaultUnitKeys = ['lh', 'zi', 'fw', 'op']; // 不添加默认单位的关键字列表

    Object.keys(map).forEach(key => {
        const property = map[key];
        if (key === 'm' || key === 'p') {
            // 对于 margin 和 padding 的特殊处理
            const boxModelRegex = new RegExp(`^(${key})((?:[\\|\\-]?\\d+(?:px|em|rem|vh|vw|%)?)+)(!?)$`);
            rules.push([boxModelRegex, match => {
                const values = match[2].replace(/\-/g, '|'); // 统一处理为 "|" 分隔符
                const important = match[3] === '!' ? ' !important' : '';
                const cssProperty = key === 'm' ? 'margin' : 'padding';
                const boxModelValue = parseBoxModelValues(values, defaultUnit, cssProperty);
                return { [cssProperty]: `${boxModelValue[cssProperty]}${important}` };
            }]);
        } else {
            // 对于其他 CSS 属性的处理
            const regex = new RegExp(`^(${key})([\\.\\d]+)(vw|vh|px|em|rem|%)?(!?)$`);
            const rule = [regex, ([_, prop, num, unit, important]) => {
                if (num === '0' || (noDefaultUnitKeys.includes(prop) && !unit)) {
                    unit = ''; // 对于0或指定关键字属性，不添加单位
                } else {
                    unit = unit || defaultUnit; // 使用指定或默认单位
                }
                important = important === '!' ? ' !important' : ''; // 处理 !important 标志
                if (Array.isArray(property)) {
                    // 如果属性是数组，为每个属性生成规则
                    return property.reduce((acc, current) => {
                        acc[current] = `${num}${unit}${important}`;
                        return acc;
                    }, {});
                } else {
                    // 单个属性
                    return { [property]: `${num}${unit}${important}` };
                }
            }];
            rules.push(rule);
        }
    });

    return rules;
}

export const legocss = {
    name: 'legocss',
    rules: [

        ...getRules(propertyMap),
        ...otherRules,
        ...borderRules,
        ...textDecorationRules,

    ],
    variants: [
        // hover:
        (matcher) => {
            if (!matcher.startsWith('h:'))
                return matcher
            return {
                // slice `hover:` prefix and passed to the next variants and rules
                matcher: matcher.slice(2),
                selector: s => `${s}:hover`,
            }
        },
        // focus:
        (matcher) => {
            if (!matcher.startsWith('f:'))
                return matcher
            return {
                // slice `focus:` prefix and passed to the next variants and rules
                matcher: matcher.slice(2),
                selector: s => `${s}:focus`,
            }
        },
        (matcher) => {
            if (!matcher.startsWith('fl::'))
                return matcher
            return {
                // slice `focus:` prefix and passed to the next variants and rules
                matcher: matcher.slice(4),
                selector: s => `${s}::first-letter`,
            }
        },
        (matcher) => {
            if (!matcher.startsWith('a::'))
                return matcher
            return {
                // slice `focus:` prefix and passed to the next variants and rules
                matcher: matcher.slice(3),
                selector: s => `${s}::after`,
            }
        },
        // active:
        (matcher) => {
            if (!matcher.startsWith('a:'))
                return matcher
            return {
                // slice `active:` prefix and passed to the next variants and rules
                matcher: matcher.slice(2),
                selector: s => `${s}:active`,
            }
        },
        // important:
        (matcher) => {
            const flag = matcher.endsWith('!')
            const config = {
                important: false
            }
            const isImportant = flag ? !config.important : config.important
            return {
                matcher: flag ? matcher.substring(0, matcher.length - 1) : matcher,
                body: (body) => {
                    body.forEach((v) => {
                        if (v[1]) {
                            v[1] += isImportant ? ' !important' : ''
                        }
                    })
                    return body
                },
            }
        }

    ],
    shortcuts: [
        // 正方形
        [
            new RegExp(`^s(\\d+)(${unitRegexPart})?(?:-(\\d+)(${unitRegexPart})?)?$`),
            ([, width, widthUnit = '', height, heightUnit = '']) => {
                // 设置宽度单位的默认值为空字符串，以便在未指定单位时不添加单位
                // 如果只有宽度值，那么高度值将复用宽度的数值和单位
                height = height || width;
                widthUnit = widthUnit || '';
                heightUnit = heightUnit || '';
        
                return `w${width}${widthUnit} h${height}${heightUnit}`;
            }
        ],
        
        // 垂直水平居中
        ['center', 'flex justify-center items-center'],
        {
            'myclass': 'm0 p0 bgc000',
            'myclass2': 'm0 p0 bgcblue',
        },
        [/^btn-(.*)$/, ([, c]) => `py-2 px-4 rounded-lg`],
        // flex
        [
            /^f-((c|s|e)(-(c|s|e|b|a))*)$/,
            ([, , g1, , g2]) => {
                let style = ``;
                const temps = [
                    { k: "c", v: "center" },
                    { k: "s", v: "start" },
                    { k: "e", v: "end" },
                    { k: "b", v: "between" },
                    { k: "a", v: "around" }
                ];

                const r1 = temps.find(i => i.k == g1);
                style = `flex items-${r1?.v || "center"} content-${r1?.v || "center"}`;

                if (g2) {
                    const r2 = temps.find(i => i.k == g2);
                    style += ` justify-${r2?.v || "center"}`;
                }

                return style;
            }
        ]
    ],
    transformers: [
        parseBorder(),
        parseTextShadow(),
        transformerVariantGroup(),
    ],  
};
export default legocss;