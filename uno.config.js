import { defineConfig, presetAttributify, presetUno, presetMini} from 'unocss'
import {legocss} from './lego.unocss'
import transformerVariantGroup from './src/parse/transformer-variant-group'
import parseTextShadow from './src/parse/parse-text-shadow'
import parseBorder from './src/parse/parse-border'

export default defineConfig({
  // ...UnoCSS options
    presets: [
        presetUno(),
        presetMini(),
        presetAttributify(),
        legocss,
    ],
    transformers: [
      transformerVariantGroup(),
      parseTextShadow(),
      parseBorder(),
    ],
    plugins: [
      
    ],
})