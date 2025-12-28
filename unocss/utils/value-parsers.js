export const unitRegexPart = 'px|em|rem|vh|vw|%|svh|lvh|svw|lvw|dvw|svi|lvi|dvb'

/**
 * 将 box model 数值拆分并拼接成合法的 CSS 声明值。
 * 使用 "|" 或 "-" 分隔的数字都会被解析，未显式提供单位时补默认单位。
 * @param {string} values 例如 "10|20|30|40"
 * @param {{ defaultUnit?: string, property: string }} options
 * @returns {string} 拼接后的值，如 "10px 20px 30px 40px"
 */
export function parseBoxModelValues(values, { defaultUnit = 'px', property }) {
  const parts = values
    .split(/[|-]/)
    .map((raw) => {
      const match = raw.match(new RegExp(`^(\\d+)(?:(${unitRegexPart}))?$`))
      if (!match) return ''
      const [, num, explicitUnit] = match
      const unit = explicitUnit ?? defaultUnit
      return `${num}${unit}`
    })
    .filter(Boolean)

  return { [property]: parts.join(' ') }
}

/**
 * 基于属性映射生成数字/单位类名规则。
 * 负责处理默认单位、无单位属性以及 "!important" 标记。
 * @param {Record<string, string | string[]>} map 缩写到 CSS 属性的映射
 * @param {{ defaultUnit?: string, unitlessKeys?: string[] }} options
 * @returns {import('unocss').Rule<{}>[]}
 */
export function buildNumericRules(map, options = {}) {
  const defaultUnit = options.defaultUnit ?? 'px'
  const unitlessKeys = options.unitlessKeys ?? ['lh', 'zi', 'fw', 'op']
  const rules = []

  Object.entries(map).forEach(([token, property]) => {
    if (token === 'm' || token === 'p' || token === 'gap') {
      const boxRegex = new RegExp(
        `^(${token})((?:[\\|-]?\\d+(?:${unitRegexPart})?)+)(!?)$`
      )
      rules.push([
        boxRegex,
        ([, , rawValues, importantFlag]) => {
          const cssProperty =
            token === 'm' ? 'margin' : token === 'p' ? 'padding' : 'gap'
          const important = importantFlag ? ' !important' : ''
          const parsed = parseBoxModelValues(rawValues, {
            defaultUnit,
            property: cssProperty,
          })
          return { [cssProperty]: `${parsed[cssProperty]}${important}` }
        },
      ])
      return
    }

    const numericRegex = new RegExp(
      `^(${token})(\\d+(?:\\.\\d+)?)(?:(${unitRegexPart}))?(!?)$`
    )
    rules.push([
      numericRegex,
      ([, prop, value, explicitUnit, importantFlag]) => {
        const shouldOmitUnit =
          value === '0' || (unitlessKeys.includes(prop) && !explicitUnit)
        const unit = shouldOmitUnit ? '' : explicitUnit ?? defaultUnit
        const important = importantFlag ? ' !important' : ''
        const cssValue = `${value}${unit}${important}`

        if (Array.isArray(property)) {
          return property.reduce((acc, current) => {
            acc[current] = cssValue
            return acc
          }, {})
        }

        return { [property]: cssValue }
      },
    ])
  })

  return rules
}
