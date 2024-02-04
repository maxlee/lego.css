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
    | shortcut |       mean       | desc  |
    | :------: | :--------------: | :---: |
    |    m     |      margin      |   ✓   |
    |    p     |     padding      |   ✓   |
    |    w     |      width       |   ✓   |
    |    h     |      height      |   ✓   |
    |    nw    |    min-width     |   ✓   |
    |    nh    |    min-height    |   ✓   |
    |    mw    |    max-width     |   ✓   |
    |    mh    |    max-height    |   ✓   |
    |    t     |       top        |   ✓   |
    |    r     |      right       |   ✓   |
    |    b     |      bottom      |   ✓   |
    |    l     |       left       |   ✓   |
    |    x     |  left and right  |   ✓   |
    |    y     |  top and bottom  |   ✓   |
    |    d     |     display      |   ✓   |
    |    po    |     position     |   ✓   |
    |    c     |      color       |   ✓   |
    |   h:x    |    x:hover{}     |   ✓   |
    |   a:x    |    x:active{}    |   ✓   |
    |   f:x    |    x:focus{}     |   ✓   |
    |    x!    | x{...!important} |   ✓   |
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
        - [x] color
        - [x] background-color
        - [x] border-color
    3. font/text
        - [ ] font
        - [ ] font-family
        - [x] font-style: normal|italic|oblique|inherit
        - [x] font-size
        - [x] font-weight
        - [x] text-align: left|right|center|justify
        - [x] line-height
        - [ ] justify-content
        - [x] letter-spacing
        - [x] word-spacing
        - [ ] outline
        - [ ] white-space
        - [ ] word-break: normal|break-all|keep-all
        - [ ] word-wrap: normal|break-word
        - [ ] text-indent
        - [ ] text-justify
        - [ ] text-overflow: clip|ellipsis
    4. box
        - [x] display: none|block|inline|inline-block|inherit
        - [ ] box-sizing: content-box|border-box
        - [x] width
        - [x] height
        - [x] min/max
        - [x] padding
        - [ ] border
        - [x] margin
    5. animate
        - [ ] animate
        - [ ] transition
        - [ ] keyframe
    6. element
        - [x] position: absolute|fixed|relative|static|sticky
        - [x] float: left|right|none|inherit
        - [x] cursor: default|auto|pointer|move|text|wait|help
        - [ ] background-size: length|cover|contain
        - [ ] background-position: center
        - [ ] background-repeat: repeat-y|repeat-x|no-repeat
        - [ ] list-style-
        - [x] z-index
        - [x] overflow: auto|hidden|scroll|visible
        - [x] opacity
        - [x] visibility: hidden|visible
        - [x] vertical-align: baseline|top|text-top|middle|bottom|text-bottom
        - [x] resize: none|both|horizontal|vertical

## 使用方式

1. HTML\<link\> + PurgeCSS 
2. npm/yarn + PurgeCSS
3. UnoCSS + rules

## Fonts
> https://github.com/zenozeng/fonts.css
```
ffh|ffk|ffs|fffs
```