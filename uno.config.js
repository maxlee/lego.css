import { defineConfig, presetAttributify, presetUno, presetMini} from 'unocss'
import transformerCompileClass from '@unocss/transformer-compile-class'
import legocss from './lego.unocss'

export default defineConfig({
  // ...UnoCSS options
    presets: [
        presetUno(),
        presetMini(),
        // presetAttributify(),
        legocss,
    ],
    transformers: [
        transformerCompileClass(),
        ...legocss.transformers
    ],
})