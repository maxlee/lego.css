import { defineConfig, presetAttributify, presetUno, presetMini} from 'unocss'
import legocss from './lego.unocss'

export default defineConfig({
  // ...UnoCSS options
    presets: [
        presetUno(),
        presetMini(),
        presetAttributify(),
        legocss,
    ],
    transformers: [
        ...legocss.transformers
    ],
    plugins: [
      
    ],
})