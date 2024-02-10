import { defineConfig, presetAttributify, presetUno } from 'unocss'
import {legocss} from './lego.unocss'
import transformerVariantGroup from './src/js/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
    presets: [
        // presetUno(),
        presetAttributify(),
        legocss,
    ],
    transformers: [
      transformerVariantGroup()
    ]
})