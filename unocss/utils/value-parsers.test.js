import { describe, expect, it } from 'vitest'

import { propertyMap } from '../rules/propertyMap.js'
import { buildNumericRules, parseBoxModelValues } from './value-parsers.js'

const applyRule = (rules, token) => {
  for (const [regex, handler] of rules) {
    const match = token.match(regex)
    if (match) {
      return handler(match)
    }
  }
  return null
}

describe('parseBoxModelValues', () => {
  it('补默认单位并按顺序拼接值', () => {
    const parsed = parseBoxModelValues('10|20-30', {
      defaultUnit: 'px',
      property: 'margin',
    })

    expect(parsed).toEqual({ margin: '10px 20px 30px' })
  })

  it('保留显式单位', () => {
    const parsed = parseBoxModelValues('5rem|15', {
      defaultUnit: 'px',
      property: 'padding',
    })

    expect(parsed).toEqual({ padding: '5rem 15px' })
  })
})

describe('buildNumericRules', () => {
  const rules = buildNumericRules(propertyMap, {
    defaultUnit: 'px',
    unitlessKeys: ['lh', 'zi', 'fw', 'op'],
  })

  it('为常规属性追加默认单位', () => {
    expect(applyRule(rules, 'w12')).toEqual({ width: '12px' })
    expect(applyRule(rules, 'w12.5rem')).toEqual({ width: '12.5rem' })
  })

  it('尊重无单位属性与 0 值', () => {
    expect(applyRule(rules, 'lh16')).toEqual({ 'line-height': '16' })
    expect(applyRule(rules, 'op0')).toEqual({ opacity: '0' })
  })

  it('处理 box model 縮寫与 !important', () => {
    expect(applyRule(rules, 'm10-20!')).toEqual({ margin: '10px 20px !important' })
    expect(applyRule(rules, 'gap8')).toEqual({ gap: '8px' })
  })
})
