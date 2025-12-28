import { parseBorder } from './parse-border.js'
import { parseTextShadow } from './parse-text-shadow.js'
import { transformerVariantGroup } from './transformer-variant-group.js'

/**
 * 组合 lego.css 预设需要的自定义 transformers。
 * @param {object} options 预留扩展位，便于未来通过参数控制 transformer 行为
 * @returns {import('unocss').Transformer[]} 自定义 transformer 列表
 */
export function legoTransformers(options = {}) {
  return [
    parseBorder(options),
    parseTextShadow(options),
    transformerVariantGroup(options),
  ]
}

export { parseBorder, parseTextShadow, transformerVariantGroup }
