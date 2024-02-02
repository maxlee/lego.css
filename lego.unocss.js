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
    'lt': 'letter-spacing',
    'ws': 'word-spacing',
    // 可以在这里继续添加更多属性对应关系
};

// 定义一个函数来生成基于属性映射的规则
function getRules(map, defaultUnit = 'px') {
    const rules = [];
    const propsRegexPart = Object.keys(map).join('|');
  
    Object.keys(map).forEach(key => {
      const property = map[key];
      // 更新正则表达式以同时匹配单位和!important标志
      const regex = new RegExp(`^(${key})([\\.\\d]+)(vw|vh)?(!?)$`);
  
      const rule = [regex, ([_, prop, num, unit, important]) => {
        unit = unit || defaultUnit; // 使用捕获的单位或默认单位
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
    ['oh', { overflow: 'hidden' }],
    ['ov', { overflow: 'visible' }],
    ['oxh', { 'overflow-x': 'hidden' }],
    ['oxv', { 'overflow-x': 'visible' }],
    ['oyh', { 'overflow-y': 'hidden' }],
    ['oyv', { 'overflow-y': 'visible' }],
    ['vbh', { 'visibility': 'hidden' }],
    ['vbv', { 'visibility': 'visible' }],
];

export const legocss = {
    name: 'legocss',
    rules: [

        ...getRules(propertyMap),
        ...otherRules,

        [/^c([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(!?)$/, ([_, color, i]) => ({ 'color': `#${color} ${i ? '!important' : ''}` })],
        [/^bgc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'background-color': `#${color} ${i ? '!important' : ''}` })],
        [/^bc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'border-color': `#${color} ${i ? '!important' : ''}` })],

        // [/^c-(.+)$/, ([, color]) => ({ 'color': `#${color}` })],

        [/^fw([\.\d]+)(!?)$/, ([_, num, i]) => ({ 'font-weight': `${num} ${i ? '!important' : ''}` })],
        [/^op([\.\d]+)(!?)$/, ([_, num, i]) => ({ 'opacity': `${num} ${i ? '!important' : ''}` })],
        [/^lh([\.\d]+)(px)?(!?)$/, ([_, num, unit, i]) => ({ 'line-height': `${num}${unit ? 'px' : ''} ${i ? '!important' : ''}` })],
        [/^z([\.\d]+)(!?)$/, ([_, num, i]) => ({ 'z-index': `${num} ${i ? '!important' : ''}` })],


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