# LEGO.css

`lego.css` 基于原子类和 `Pure CSS` 两者的思想设计，可以帮助更快更轻松的编写页面 CSS 样式，平滑解决项目中 CSS 难复用、难扩展、难维护的问题。

## 兼容性
> 注明使用了哪些特征，因此不兼容的浏览器版本，提供 caniuse 截图

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
   1. l-{}
   2. c-{}
   3. t-{}
      1. font
      2. text-
      3. line-height
      4. justify-content
      5. letter-spacing
      6. word-spacing
      7. outline
   4. b-{}
      1. display
      2. box-sizing
      3. width
      4. height
      5. min/max-
      6. padding
      7. border
      8. margin
   5. a-{}
      1. animate
      2. transition
      3. keyframe
   6. e-
      1. position
      2. cursor
      3. background
      4. list-style-
      5. z-index
      6. overflow

## 使用方式
1. link
2. import + PurgeCSS
3. UnoCSS + rules