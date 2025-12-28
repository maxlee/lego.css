import transformerCompileClass from '@unocss/transformer-compile-class'
import { defineConfig, presetUno } from 'unocss'

import legoPreset from './lego.unocss.js'

const lego = legoPreset()

export default defineConfig({
  presets: [
    presetUno(),
    lego,
  ],
  transformers: [
    transformerCompileClass(),
    ...(lego.transformers || []),
  ],
})
