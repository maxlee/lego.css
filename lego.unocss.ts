// lego.unocss.ts
import { Preset } from 'unocss'

export const legocss: Preset = {
  name: 'legocss',
  rules: [
    [/^m([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
    [/^mx([\.\d]+)$/, ([_, num]) => ({ 'margin-left': `${num}px`, 'margin-right': `${num}px` })],
    [/^my([\.\d]+)$/, ([_, num]) => ({ 'margin-top': `${num}px`, 'margin-bottom': `${num}px` })],
    [/^ml([\.\d]+)$/, ([_, num]) => ({ 'margin-left': `${num}px` })],
    [/^mr([\.\d]+)$/, ([_, num]) => ({ 'margin-right': `${num}px` })],
    [/^mb([\.\d]+)$/, ([_, num]) => ({ 'margin-bottom': `${num}px` })],
    [/^mt([\.\d]+)$/, ([_, num]) => ({ 'margin-top': `${num}px` })],
    [/^p([\.\d]+)$/, ([_, num]) => ({ padding: `${num}px` })],
    [/^px([\.\d]+)$/, ([_, num]) => ({ 'padding-left': `${num}px`, 'padding-right': `${num}px` })],
    [/^py([\.\d]+)$/, ([_, num]) => ({ 'padding-top': `${num}px`, 'padding-bottom': `${num}px` })],
    [/^pl([\.\d]+)$/, ([_, num]) => ({ 'padding-left': `${num}px` })],
    [/^pr([\.\d]+)$/, ([_, num]) => ({ 'padding-right': `${num}px` })],
    [/^pb([\.\d]+)$/, ([_, num]) => ({ 'padding-bottom': `${num}px` })],
    [/^pt([\.\d]+)$/, ([_, num]) => ({ 'padding-top': `${num}px` })],
    [/^w([\.\d]+)$/, ([_, num]) => ({ width: `${num}px` })],
    [/^h([\.\d]+)$/, ([_, num]) => ({ height: `${num}px` })],
    [/^nw([\.\d]+)$/, ([_, num]) => ({ 'min-width': `${num}px` })],
    [/^nh([\.\d]+)$/, ([_, num]) => ({ 'min-height': `${num}px` })],
    [/^mw([\.\d]+)$/, ([_, num]) => ({ 'max-width': `${num}px` })],
    [/^mh([\.\d]+)$/, ([_, num]) => ({ 'max-height': `${num}px` })],
    [/^fs([\.\d]+)$/, ([_, num]) => ({ 'font-size': `${num}px` })],
    ['ma', {margin:'auto'}],
    ['mx', {'margin-left': 'auto','margin-right': 'auto' }]
  ],
  variants: [/* ... */],
  shortcuts: [
  ]
}