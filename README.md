<p align="center">
    <img src="/public/lego.png" width="100px">
</p>
<h1 align="center">lego.css</h1>
<h4 align="center">Write CSS like LEGO</h4>
<p>`lego.css` 基于原子类和 `Pure CSS` 两者的思想设计，可以帮助更快更轻松的编写页面 CSS 样式，平滑解决项目中 CSS 难复用、难扩展、难维护的问题。</p>

## 响应式断点前缀

- 内置 `sm / md / lg / xl / 2xl`，分别对应 `@media (min-width: 640/768/1024/1280/1536px)`。
- 可与伪类和分组组合使用，例如 `md:h:bgc#f00` 或 `md:(d-flex gp16)`。

## 架构

1. Naming
   - [ ] HTML: BEM
   - [x] Atomic: https://xmind.ai/share/fZ0Oh0KU

    |      shortcut       |       mean       | desc  |
    | :-----------------: | :--------------: | :---: |
    |          m          |      margin      |   ✓   |
    |      m{y}\|{x}      |      margin      |   ✓   |
    |   m{t}\|{x}\|{b}    |      margin      |   ✓   |
    | m{t}\|{r}\|{b}\|{l} |      margin      |   ✓   |
    |          p          |     padding      |   ✓   |
    |          w          |      width       |   ✓   |
    |          h          |      height      |   ✓   |
    |          s          |   width&height   |   ✓   |
    |         nw          |    min-width     |   ✓   |
    |         nh          |    min-height    |   ✓   |
    |         mw          |    max-width     |   ✓   |
    |         mh          |    max-height    |   ✓   |
    |          t          |       top        |   ✓   |
    |          r          |      right       |   ✓   |
    |          b          |      bottom      |   ✓   |
    |          l          |       left       |   ✓   |
    |          x          |  left and right  |   ✓   |
    |          y          |  top and bottom  |   ✓   |
    |         d-          |     display      |   ✓   |
    |         p-          |     position     |   ✓   |
    |          c          |      color       |   ✓   |
    |         h:?         |   ?:hover{...}   |   ✓   |
    |       h:(? ?)       | ...?:hover{...}  |   ✓   |
    |         a:?         |  ?:active{...}   |   ✓   |
    |       a:(? ?)       | ...?:active{...} |   ✓   |
    |         f:?         |   ?:focus{...}   |   ✓   |
    |       f:(? ?)       | ...?:focus{...}  |   ✓   |
    |         ?!          | ?{...!important} |   ✓   |
2. Reset
   - [x] Normalize.css
3. Base
   - [ ] _variable
   - [ ] _mixins
   - [ ] _color
   - [ ] _icon
   - [ ] _typography
   - [ ] _layout
   - [ ] _button
   - [ ] _from
   - [ ] _table
4. Component
   - [ ] accordion
   - [ ] breadcrumb
   - [ ] card
   - [ ] switch
   - [ ] tab
   - [ ] dialog
5. Atomic
    1. flex
        - [ ] flex-direction → fd-row|row-reverse|column|column-reverse
        - [ ] flex-wrap → fw-nowrap|wrap|wrap-reverse
        - [ ] flex-flow → ff[flex-direction flex-wrap]
        - [ ] justify-content → jc-flex-start|flex-end|center|space-around|space-between|space-evenly
        - [ ] align-items → ai-stretch|flex-start|flex-end|center|baseline
        - [ ] align-content → ac-stretch|flex-start|flex-end|center|space-around|space-between
        - [ ] order → o
        - [ ] flex → flex[flex-grow flex-shrink flex-basis]
        - [ ] align-self → as-auto|flex-start|flex-end|center|baseline|stretch
    2. grid
        - [ ] 
    3. color
        - [x] color → c
        - [x] background-color → bgc
        - [x] border-color → bc
    4. font/text
        - [ ] font
        - [x] font-family → ff-k|h|s|fs
        - [x] font-style → fs-normal|italic|oblique|initial|inherit
        - [x] font-size → fs
        - [x] font-variant → fv-normal|small-caps|initial|inherit
        - [x] font-weight → fw
        - [x] direction → dir-ltr|rtl|initial|inherit
        - [x] unicode-bidi → normal|embed|bidi-override|initial|inherit
        - [x] line-height → lh
        - [x] letter-spacing → ls
        - [x] word-spacing → ws
        - [x] text-align → ta-left|right|center|justify|inherit
        - [x] text-decoration → td-text-decoration-line text-decoration-color text-decoration-style text-decoration-thickness|initial|inherit;
        - [x] text-indent → ti
        - [x] text-shadow → ts:
        - [x] text-transform → tr-none|capitalize|uppercase|lowercase|initial|inherit
        - [x] white-space → normal|nowrap|pre|pre-line|pre-wrap|initial|inherit
        - [x] justify-content → jc-
        - [x] word-break → wb-normal|break-all|keep-all
        - [x] word-wrap → ww-normal|break-word
        - [x] text-justify → tj-auto|inter-word|inter-ideograph|inter-cluster|distribute|kashida|trim
        - [x] text-overflow → clip|ellipsis|string
        - [x] writing-mode → wm-horizontal-tb|vertical-rl|vertical-lr
        - [x] user-select → auto|none|text|all
    5. box
        - [x] display → d-none|block|inline|inline-block|inherit
        - [x] box-sizing → bs-content-box|border-box
        - [x] width → w
        - [x] height → h
        - [x] min-width → nw
        - [x] min-height → nh
        - [x] max-width → mw
        - [x] max-height → mh
        - [x] padding → p
        - [x] margin → m
        - [x] border → bd:
        - [x] border-top → bdt:
        - [x] border-right → bdr:
        - [x] border-bottom → bdb:
        - [x] border-left → bdl:
        - [x] border-style → bds-none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|initial|inherit
        - [x] border-width → bw
        - [x] outline → ol:
    6. animate
        - [ ] animate
        - [ ] transition
        - [ ] keyframe
    7. element
        - [x] position → p-absolute|fixed|relative|static|sticky
        - [x] float → f-left|right|none|inherit
        - [x] cursor → c-default|auto|pointer|move|text|wait|help
        - [ ] background
        - [x] background-attachment → ba-fixed|local|scroll
        - [x] background-size → bs-length|cover|contain
        - [x] background-position → bp-center|top|right|bottom|right
        - [x] background-repeat → br-repeat-y|repeat-x|no-repeat
        - [x] background-image → bgi(url)
        - [x] overflow → o-auto|hidden|scroll|visible
        - [x] overflow-x → ox-auto|hidden|scroll|visible
        - [x] overflow-y → oy-auto|hidden|scroll|visible
        - [x] opacity → o
        - [x] visibility → v-hidden|visible
        - [x] vertical-align → va-baseline|top|text-top|middle|bottom|text-bottom
        - [x] resize → r-none|both|horizontal|vertical
        - [x] z-index → zi
    8. list
        - [x] list-style → ls
        - [x] list-style-image → lsi()
        - [x] list-style-position → lsp-inside|outside
        - [x] list-style-type → lst-none|disc|circle|square
        - [ ] marker-offset
    9. 伪类
        - [ ] :active
        - [ ] :any-link
        - [ ] :checked
    10. 伪元素
        - [ ] ::after
        - [ ] ::before
        - [ ] ::first-letter
        - [ ] ::first-line
        - [ ] ::marker
        - [ ] ::placeholder
        - [ ] ::selection

## 使用方式

1. HTML\<link\> + PurgeCSS 
2. npm/yarn + PurgeCSS
3. UnoCSS + rules

## Fonts
> https://github.com/zenozeng/fonts.css
```
ff-h|ff-k|ff-s|ff-fs
```
