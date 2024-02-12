// lego.unocss.js
import { Preset } from 'unocss'
import { propertyMap } from './src/js/propertyMap.js'
import { otherRules } from './src/js/otherRules.js'
import { colorRules } from './src/js/colorRules.js'
import { borderRules } from './src/js/borderRules.js'

// 单独处理margin/padding属性值的函数
/**
 * @param {String} values 属性值
 * @param {String} defaultUnit 默认单位
 * @param {String} property 属性名
 * @returns {Object} CSS属性值对象
 */
function parseBoxModelValues(values, defaultUnit, property) {
    const parts = values.split('|').map(part => {
        const match = part.match(/(\d+)(px|em|rem|vh|vw|%)?/);
        if (match) {
            const num = match[1];
            const unit = match[2] || defaultUnit;
            return `${num}${unit}`;
        }
        return '';
    }).join(' ');
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
    const propsRegexPart = Object.keys(map).join('|');
    // 定义不添加默认单位的关键字列表
    const noDefaultUnitKeys = ['lh', 'zi', 'fw', 'op'];

    Object.keys(map).forEach(key => {

        const property = map[key];
        // 更新正则表达式以同时匹配单位和!important标志
        const regex = new RegExp(`^(${key})([\\.\\d]+)(vw|vh|px|em|rem|%)?(!?)$`);

        if (key === 'm' || key === 'p') {
            // 使用新的正则表达式匹配 margin 或 padding 的值
            const boxModelRegex = new RegExp(`^(${key})((?:\\|?\\d+(?:px|em|rem|vh|vw|%)?)+)(!?)$`);
            rules.push([boxModelRegex, match => {
                const values = match[2];
                const important = match[3] === '!' ? ' !important' : '';
                const cssProperty = key === 'm' ? 'margin' : 'padding';
                const boxModelValue = parseBoxModelValues(values, defaultUnit, cssProperty);
                return { [cssProperty]: `${boxModelValue[cssProperty]}${important}` };
            }]);
        } else {

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

        }

    });

    return rules;
}


export const legocss = {
    name: 'legocss',
    rules: [

        ...getRules(propertyMap),
        ...otherRules,
        ...colorRules,
        ...borderRules,
        // 实现一个规则，当用户可以输入`ts:5-2-4-000` 来设置text-shadow的值为`5px 2px 4px #000`，其中如果第三个值为空，则默认为0, 如果第四个颜色值为空，则默认为 #000
        [/^ts:(-?[0-9]+)-(-?[0-9]+)(?:-([0-9]+))?(?:-([0-9a-fA-F]{3,6}))?$/, ([_, x, y, blur, color]) => ({ 'text-shadow': `${x}px ${y}px ${blur ? blur + 'px' : '0'} ${color ? '#' + color : '#000'}` })],        

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