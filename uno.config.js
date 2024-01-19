import { defineConfig, presetAttributify, presetUno } from 'unocss'
import {legocss} from './lego.unocss'

export default defineConfig({
  // ...UnoCSS options
    presets: [
        // presetUno(),
        // presetAttributify(),
        legocss,
    ],
})