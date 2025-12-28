import { definePreset } from 'unocss'
import {
  borderRules,
  otherRules,
  propertyMap,
  pseudoClassRules,
  pseudoElementRules,
  textDecorationRules,
} from './rules/index.js'
import { legoTransformers } from './transformers/index.js'
import { buildNumericRules, unitRegexPart } from './utils/value-parsers.js'

/**
 * 生成支持 "!important" 的变体。
 * 末尾添加 "!" 将与默认 important 行为取反，便于在局部关闭或开启。
 * @param {boolean} importantByDefault 是否默认启用 !important
 * @returns {import('unocss').Variant} UnoCSS 变体
 */
export function createImportantVariant(importantByDefault = false) {
  return (matcher) => {
    const hasImportantSuffix = matcher.endsWith('!')
    const enableImportant = hasImportantSuffix ? !importantByDefault : importantByDefault
    const cleanMatcher = hasImportantSuffix ? matcher.slice(0, -1) : matcher

    return {
      matcher: cleanMatcher,
      body(body) {
        return body.map((declaration) => {
          if (Array.isArray(declaration) && typeof declaration[1] === 'string') {
            declaration[1] = `${declaration[1]}${enableImportant ? ' !important' : ''}`
          }
          return declaration
        })
      },
    }
  }
}

export const legoPreset = definePreset((options = {}) => {
  const {
    defaultUnit = 'px',
    unitlessKeys = ['lh', 'zi', 'fw', 'op'],
    important = false,
  } = options

  return {
    name: 'legocss',
    rules: [
      ...buildNumericRules(propertyMap, { defaultUnit, unitlessKeys }),
      ...otherRules,
      ...borderRules,
      ...textDecorationRules,
    ],
    variants: [
      ...pseudoElementRules,
      ...pseudoClassRules,
      createImportantVariant(important),
    ],
    shortcuts: [
      [
        new RegExp(`^s(\\d+)(${unitRegexPart})?(?:-(\\d+)(${unitRegexPart})?)?$`),
        ([, width, widthUnit = '', height, heightUnit = '']) => {
          const normalizedHeight = height || width
          return `w${width}${widthUnit || ''} h${normalizedHeight}${heightUnit || ''}`
        },
      ],
      ['center', 'flex justify-center items-center'],
      {
        myclass: 'm0 p0 bgc000',
        myclass2: 'm0 p0 bgcblue',
      },
      [/^btn-(.*)$/, () => 'py-2 px-4 rounded-lg'],
      [
        /^f-((c|s|e)(-(c|s|e|b|a))*)$/,
        ([, , firstGroup, , secondGroup]) => {
          const maps = [
            { k: 'c', v: 'center' },
            { k: 's', v: 'start' },
            { k: 'e', v: 'end' },
            { k: 'b', v: 'between' },
            { k: 'a', v: 'around' },
          ]

          const primary = maps.find((item) => item.k === firstGroup)
          let style = `flex items-${primary?.v || 'center'} content-${primary?.v || 'center'}`

          if (secondGroup) {
            const secondary = maps.find((item) => item.k === secondGroup)
            style += ` justify-${secondary?.v || 'center'}`
          }

          return style
        },
      ],
    ],
    transformers: legoTransformers(options),
  }
})

export default legoPreset
export { legoTransformers, unitRegexPart }
