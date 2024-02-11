import { defineConfig, presetAttributify, presetUno } from 'unocss'
import {legocss} from './lego.unocss'
import transformerVariantGroup from './src/js/transformer-variant-group'
import parseTextShadow from './src/js/parse-text-shadow'

export default defineConfig({
  // ...UnoCSS options
    presets: [
        // presetUno(),
        presetAttributify(),
        legocss,
    ],
    transformers: [
      transformerVariantGroup(),
      parseTextShadow(),
    ],
    plugins: [
      
    ],
})