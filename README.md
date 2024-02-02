<p align="center">
    <img src="/public/lego.png" width="100px">
</p>
<h1 align="center">lego.css</h1>
<h4 align="center">Write CSS like LEGO</h4>
<p>`lego.css` 基于原子类和 `Pure CSS` 两者的思想设计，可以帮助更快更轻松的编写页面 CSS 样式，平滑解决项目中 CSS 难复用、难扩展、难维护的问题。</p>

## Todo
- [ ] lego.layout.css
- [ ] lego.color.css
- [ ] lego.base.css

## 架构

1. Naming
    1. BEM
2. Reset
    1. Normalize.css
3. Base
    1. variable
    2. mixins
    3. color
    4. icon
    5. typography
    6. layout
    7. button
    8. from
    9. table
4. Component
    1. accordion
    2. breadcrumb
    3. card
    4. switch
    5. tab
    6. dialog
5. Atomic
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
   |    d     |     display      |       |
   |    po    |     position     |       |
   |    c     |      color       |   ✓   |
   |   h:x    |    x:hover{}     |   ✓   |
   |   a:x    |    x:active{}    |   ✓   |
   |   f:x    |    x:focus{}     |   ✓   |
   |    x!    | x{...!important} |   ✓   |
    1. l-*{layout}
       1. flex
       2. grid
    2. c-*{color}
       1. color ✓
       2. background-color ✓
       3. border-color ✓
    3. t-*{text}
        1. font
        2. font-family
        3. font-style: normal|italic|oblique|inherit
        4. font-size
        5. font-weight
        6. text-align: left|right|center|justify
        7. line-height
        8. justify-content
        9. letter-spacing
        10. word-spacing
        11. outline
        12. white-space
        13. word-break: normal|break-all|keep-all
        14. word-wrap: normal|break-word
        15. text-indent
        16. text-justify
        17. text-overflow: clip|ellipsis
    4. b-*{box}
        1. display: none|block|inline|inline-block|inherit
        2. box-sizing: content-box|border-box
        3. width
        4. height
        5. min/max-
        6. padding
        7. border
        8. margin
    5. a-*{animate}
        1. animate
        2. transition
        3. keyframe
    6. e-*{element}
        1. position: absolute|fixed|relative|static|sticky
        2. float: left|right|none|inherit
        3. cursor: default|auto|pointer|move|text|wait|help
        4. background-size: length|cover|contain
        5. background-position: center
        6. background-repeat: repeat-y|repeat-x|no-repeat
        7. list-style-
        8. z-index:
        9. overflow: auto|hidden|scroll|visible
        10. opacity:
        11. visibility: hidden|visible
        12. vertical-align: baseline|top|text-top|middle|bottom|text-bottom
        13. resize: none|both|horizontal|vertical
     7. g-*{}
     8. o-*{}

## 使用方式

1. HTML\<link\> + PurgeCSS 
2. npm/yarn + PurgeCSS
3. UnoCSS + rules

## font-family
> github.com/zenozeng/fonts.css
```
ffhei|ffkai|ffsong|fffangsong
```