<p align="center">
    <img src="/public/lego.png" width="100px">
</p>
<h1 align="center">lego.css</h1>
<h4 align="center">Write CSS like LEGO</h4>
<p>`lego.css` 基于原子类和 `Pure CSS` 两者的思想设计，可以帮助更快更轻松的编写页面 CSS 样式，平滑解决项目中 CSS 难复用、难扩展、难维护的问题。</p>

## 架构

1. Naming
   - [ ] HTML: BEM
   - [x] Atomic: https://xmind.ai/share/fZ0Oh0KU?xid=VxhtmBW0

    |      shortcut       |       mean       | desc  |
    | :-----------------: | :--------------: | :---: |
    |          m          |      margin      |   ✓   |
    |      m{y}\|{x}      |      margin      |   ✓   |
    |   m{t}\|{x}\|{b}    |      margin      |   ✓   |
    | m{t}\|{r}\|{b}\|{l} |      margin      |   ✓   |
    |          p          |     padding      |   ✓   |
    |          w          |      width       |   ✓   |
    |          h          |      height      |   ✓   |
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
   1. layout
        - [ ] flex
        - [ ] grid
    2. color
        - [x] color → c
        - [x] background-color → bgc
        - [x] border-color → bc
    3. font/text
        - [ ] font
        - [ ] font-family → ff-k|h|s|fs
        - [x] font-style → fs-normal|italic|oblique|initial|inherit
        - [x] font-size → fs
        - [ ] font-variant → fv-normal|small-caps|initial|inherit
        - [x] font-weight → fw
        - [ ] direction → dir-ltr|rtl|initial|inherit
        - [ ] unicode-bidi → normal|embed|bidi-override|initial|inherit
        - [x] line-height → lh
        - [x] letter-spacing → ls
        - [x] word-spacing → ws
        - [x] text-align → ta-left|right|center|justify|inherit
        - [ ] text-decoration → td-text-decoration-line text-decoration-color text-decoration-style text-decoration-thickness|initial|inherit;
        - [ ] text-indent → ti
        - [ ] text-shadow
        - [ ] text-transform → tr-none|capitalize|uppercase|lowercase|initial|inherit
        - [ ] white-space → normal|nowrap|pre|pre-line|pre-wrap|initial|inherit
        - [ ] justify-content → jc-
        - [ ] outline
        - [ ] word-break → wb-normal|break-all|keep-all
        - [ ] word-wrap → ww-normal|break-word
        - [ ] text-justify → tj-auto|inter-word|inter-ideograph|inter-cluster|distribute|kashida|trim
        - [ ] text-overflow → clip|ellipsis|string
        - [ ] writing-mode → wm-horizontal-tb|vertical-rl|vertical-lr
        - [ ] user-select → auto|none|text|all
    4. box
        - [x] display → d-none|block|inline|inline-block|inherit
        - [x] box-sizing → bs-content-box|border-box
        - [x] width → w
        - [x] height → h
        - [x] min-width → nw
        - [x] min-height → nh
        - [x] max-width → mw
        - [x] max-height → mh
        - [x] padding → p
        - [ ] border
        - [ ] border-style → bds-none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|initial|inherit
        - [x] border-width → bw
        - [x] margin → m
    5. animate
        - [ ] animate
        - [ ] transition
        - [ ] keyframe
    6. element
        - [x] position → p-absolute|fixed|relative|static|sticky
        - [x] float → f-left|right|none|inherit
        - [x] cursor → c-default|auto|pointer|move|text|wait|help
        - [ ] background-size → bs-length|cover|contain
        - [ ] background-position → bp-center
        - [ ] background-repeat → br-repeat-y|repeat-x|no-repeat
        - [ ] background-image → bi[url]
        - [x] overflow → o-auto|hidden|scroll|visible
        - [x] overflow-x → ox-auto|hidden|scroll|visible
        - [x] overflow-y → oy-auto|hidden|scroll|visible
        - [x] opacity → o
        - [x] visibility → v-hidden|visible
        - [x] vertical-align → va-baseline|top|text-top|middle|bottom|text-bottom
        - [x] resize → r-none|both|horizontal|vertical
        - [x] z-index → zi
    7. list
        - [ ] list-style
        - [ ] list-style-image
        - [ ] list-style-position
        - [ ] list-style-type
        - [ ] marker-offset

## 使用方式

1. HTML\<link\> + PurgeCSS 
2. npm/yarn + PurgeCSS
3. UnoCSS + rules

## Fonts
> https://github.com/zenozeng/fonts.css
```
ff-h|ff-k|ff-s|ff-fs
```