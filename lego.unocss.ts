// lego.unocss.ts
import { Preset } from 'unocss'

export const legocss: Preset = {
  name: 'legocss',
  rules: [
    
    [/^m([\.\d]+)(!?)$/, ([_, num, i]) => ({ margin: `${num}px ${i ? '!important' : ''}` })],
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

    [/^t([\.\d]+)(!?)$/, ([_, num, i]) => ({ top: `${num}px ${i ? '!important' : ''}` })],
    [/^l([\.\d]+)(!?)$/, ([_, num, i]) => ({ left: `${num}px ${i ? '!important' : ''}` })],
    [/^r([\.\d]+)(!?)$/, ([_, num, i]) => ({ right: `${num}px ${i ? '!important' : ''}` })],
    [/^b([\.\d]+)(!?)$/, ([_, num, i]) => ({ bottom: `${num}px ${i ? '!important' : ''}` })],

    [/^w([\.\d]+)vw$/, ([_, num]) => ({ width: `${num}vw` })],
    [/^h([\.\d]+)vh$/, ([_, num]) => ({ height: `${num}vh` })],
    [/^nw([\.\d]+)vw$/, ([_, num]) => ({ 'min-width': `${num}vw` })],
    [/^nh([\.\d]+)vh$/, ([_, num]) => ({ 'min-height': `${num}vh` })],
    [/^mw([\.\d]+)vw$/, ([_, num]) => ({ 'max-width': `${num}vw` })],
    [/^mh([\.\d]+)vh$/, ([_, num]) => ({ 'max-height': `${num}vh` })],


    [/^fs([\.\d]+)$/, ([_, num]) => ({ 'font-size': `${num}px` })],
    ['ma', {margin:'auto'}],
    ['wa', {width:'auto'}],
    ['ha', {height:'auto'}],
    ['w%', {width:'100%'}],
    ['h%', {height:'100%'}],
    [/^c([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(!?)$/, ([_, color, i]) => ({ 'color': `#${color} ${i ? '!important' : ''}` })],
    [/^bgc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'background-color': `#${color} ${i ? '!important' : ''}` })],
    [/^bc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'border-color': `#${color} ${i ? '!important' : ''}` })],
    [/^c-(.+)$/, ([, color]) => ({ 'color': `#${color}` })],

  ],
  variants: [
    // hover:
    (matcher) => {
      if (!matcher.startsWith('h:'))
        return matcher
      return {
        // slice `hover:` prefix and passed to the next variants and rules
        matcher: matcher.slice(2),
        selector: s => `${s}:hover`,
      }
    },
    // focus:
    (matcher) => {
      if (!matcher.startsWith('f:'))
        return matcher
      return {
        // slice `focus:` prefix and passed to the next variants and rules
        matcher: matcher.slice(2),
        selector: s => `${s}:focus`,
      }
    },
    // active:
    (matcher) => {
      if (!matcher.startsWith('a:'))
        return matcher
      return {
        // slice `active:` prefix and passed to the next variants and rules
        matcher: matcher.slice(2),
        selector: s => `${s}:active`,
      }
    },
    // important:
    (matcher) => {
      const flag = matcher.endsWith('!')
      const config = {
        important: false
      }
      const isImportant = flag ? !config.important : config.important
      return {
        matcher: flag ? matcher.substring(0, matcher.length - 1) : matcher,
        body: (body) => {
          body.forEach((v) => {
            if (v[1]) {
              v[1] += isImportant ? ' !important' : ''
            }
          })
          return body
        },
      }
    }

  ],
  shortcuts: [
  ]
}