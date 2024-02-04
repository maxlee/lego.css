// lego.unocss.ts
import { Preset } from 'unocss'

// 定义属性映射
const propertyMap = {
    'm': 'margin',
    'p': 'padding',
    'ml': 'margin-left',
    'mr': 'margin-right',
    'mb': 'margin-bottom',
    'mt': 'margin-top',
    'pl': 'padding-left',
    'pr': 'padding-right',
    'pb': 'padding-bottom',
    'pt': 'padding-top',
    't': 'top',
    'l': 'left',
    'r': 'right',
    'b': 'bottom',
    'w': 'width',
    'h': 'height',
    'nw': 'min-width',
    'nh': 'min-height',
    'mw': 'max-width',
    'mh': 'max-height',
    'fs': 'font-size',
    'mx': ['margin-left', 'margin-right'],
    'my': ['margin-top', 'margin-bottom'],
    'px': ['padding-left', 'padding-right'],
    'py': ['padding-top', 'padding-bottom'],
    'ls': 'letter-spacing',
    'ws': 'word-spacing',
    'lh': 'line-height',
    'zi': 'z-index',
    'op': 'opacity',
    'fw': 'font-weight',
    'ti': 'text-indent',
    // 可以在这里继续添加更多属性对应关系
};

// 定义一个函数来生成基于属性映射的规则
function getRules(map, defaultUnit = 'px') {
    const rules = [];
    const propsRegexPart = Object.keys(map).join('|');
    // 定义不添加默认单位的关键字列表
    const noDefaultUnitKeys = ['lh', 'zi', 'fw'];

    Object.keys(map).forEach(key => {
        const property = map[key];
        // 更新正则表达式以同时匹配单位和!important标志
        const regex = new RegExp(`^(${key})([\\.\\d]+)(vw|vh|px|em|rem|%)?(!?)$`);

        const rule = [regex, ([_, prop, num, unit, important]) => {
            // 如果num为0，或者属性在不添加默认单位的关键字列表中且没有指定单位，则不添加任何单位

            if (num === '0' || (noDefaultUnitKeys.includes(prop) && !unit)) {
                unit = ''; // 不使用默认单位
            } else {
                unit = unit || defaultUnit; // 使用捕获的单位或默认单位
            }
            important = important === '!' ? ' !important' : ''; // 确定是否需要!important标志

            if (Array.isArray(property)) {
                // 处理属性数组，生成多个CSS属性规则

                return property.reduce((acc, current) => {
                    acc[current] = `${num}${unit}${important}`;
                    return acc;
                }, {});
            } else {
                // 处理单个属性
                return { [property]: `${num}${unit}${important}` };
            }
        }];

        rules.push(rule);
    });

    return rules;
}
  



// 定义其他规则
const otherRules = [
    ['ma', { margin: 'auto' }],
    ['pa', { padding: 'auto' }],
    ['w', { width: '100%' }],
    ['h', { height: '100%' }],
    ['wa', { width: 'auto' }],
    ['ha', { height: 'auto' }],
    ['w%', { width: '100%' }],
    ['h%', { height: '100%' }],

    ['o-h', { overflow: 'hidden' }],
    ['o-v', { overflow: 'visible' }],
    ['ox-h', { 'overflow-x': 'hidden' }],
    ['ox-v', { 'overflow-x': 'visible' }],
    ['oy-h', { 'overflow-y': 'hidden' }],
    ['oy-v', { 'overflow-y': 'visible' }],
    ['v-h', { 'visibility': 'hidden' }],
    ['v-v', { 'visibility': 'visible' }],

    ['d-b', { 'display': 'block' }],
    ['d-i', { 'display': 'inline' }],
    ['d-f', { 'display': 'flex' }],
    ['d-g', { 'display': 'grid' }],
    ['d-ib', { 'display': 'inline-block' }],
    ['d-n', { 'display': 'none' }],

    ['bs-b', {'box-sizing': 'border-box'}],
    ['bs-c', {'box-sizing': 'content-box'}],

    ['p-r', { 'position': 'relative' }],
    ['p-a', { 'position': 'absolute' }],
    ['p-f', { 'position': 'fixed' }],
    ['p-s', { 'position': 'static' }],
    ['p-e', { 'position': 'sticky' }],

    ['fs-n', {'font-style': 'normal'}],
    ['fs-i', {'font-style': 'italic'}],
    ['fs-o', {'font-style': 'oblique'}],

    ['ta-l', {'text-align': 'left'}],
    ['ta-c', {'text-align': 'center'}],
    ['ta-r', {'text-align': 'right'}],
    ['ta-j', {'text-align': 'justify'}],

    ['td-n', {'text-decoration': 'none'}],
    ['td-u', {'text-decoration': 'underline'}],
    ['td-o', {'text-decoration': 'overline'}],
    ['td-l', {'text-decoration': 'line-through'}],
];

export const legocss = {
    name: 'legocss',
    rules: [

        ...getRules(propertyMap),
        ...otherRules,
        // 颜色相关规则
        [/^c([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(!?)$/, ([_, color, i]) => ({ 'color': `#${color} ${i ? '!important' : ''}` })],
        [/^bgc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'background-color': `#${color} ${i ? '!important' : ''}` })],
        [/^bc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'border-color': `#${color} ${i ? '!important' : ''}` })],

        // [/^c-(.+)$/, ([, color]) => ({ 'color': `#${color}` })],

        // [/^fw([\.\d]+)(!?)$/, ([_, num, i]) => ({ 'font-weight': `${num} ${i ? '!important' : ''}` })],
        // [/^op([\.\d]+)(!?)$/, ([_, num, i]) => ({ 'opacity': `${num} ${i ? '!important' : ''}` })],
        // [/^lh([\.\d]+)(px)?(!?)$/, ([_, num, unit, i]) => ({ 'line-height': `${num}${unit ? 'px' : ''} ${i ? '!important' : ''}` })],
        // [/^z([\.\d]+)(!?)$/, ([_, num, i]) => ({ 'z-index': `${num} ${i ? '!important' : ''}` })],


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
    ]
}