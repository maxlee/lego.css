import { describe, expect, it } from 'vitest'

import legoPreset, { createImportantVariant } from './preset.js'

const createBody = (value = 'color: red') => [[null, value]]

describe('createImportantVariant', () => {
  it('默认不追加 !important', () => {
    const variant = createImportantVariant()
    const matched = variant('text-12')
    const result = matched.body(createBody())
    expect(result[0][1]).toBe('color: red')
  })

  it('支持默认开启 important 并通过 "!" 取反', () => {
    const variant = createImportantVariant(true)
    const matched = variant('text-12')
    const importantApplied = matched.body(createBody())
    expect(importantApplied[0][1]).toBe('color: red !important')

    const toggled = variant('text-12!')
    const toggledBody = toggled.body(createBody())
    expect(toggledBody[0][1]).toBe('color: red')
  })
})

describe('legoPreset', () => {
  const preset = legoPreset()

  it('暴露 name 与规则/变体/转换器', () => {
    expect(preset.name).toBe('legocss')
    expect(Array.isArray(preset.rules)).toBe(true)
    expect(Array.isArray(preset.variants)).toBe(true)
    expect(Array.isArray(preset.transformers)).toBe(true)
    expect(preset.transformers).toHaveLength(3)
  })

  it('保留 important 变体在末尾，便于用户覆盖', () => {
    const variant = preset.variants.at(-1)
    const result = variant('demo!')
    const body = result.body(createBody('padding: 4px'))
    expect(body[0][1]).toBe('padding: 4px !important')
  })
})
