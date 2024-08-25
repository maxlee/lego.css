export const textRules = [

    ['ta-l', {'text-align': 'left'}],
    ['ta-c', {'text-align': 'center'}],
    ['ta-r', {'text-align': 'right'}],
    ['ta-j', {'text-align': 'justify'}],
    ['ta-u', {'text-align': 'unset'}],

    ['td-n', {'text-decoration': 'none'}],
    ['td-u', {'text-decoration': 'underline'}],
    ['td-o', {'text-decoration': 'overline'}],

    ['tj-n', {'text-justify': 'none'}],
    ['tj-a', {'text-justify': 'auto'}],
    ['tj-iw', {'text-justify': 'inter-word'}],
    ['tj-ic', {'text-justify': 'inter-character'}],

    ['dir-l', {'direction': 'ltr'}],
    ['dir-r', {'direction': 'rtl'}],

    ['ub-n', {'unicode-bidi': 'normal'}],
    ['ub-e', {'unicode-bidi': 'embed'}],
    ['ub-b', {'unicode-bidi': 'bidi-override'}],

    ['to-n', {'text-overflow': 'clip'}],
    ['to-e', {'text-overflow': 'ellipsis'}],

    ['tt-n', {'text-transform': 'none'}],
    ['tt-u', {'text-transform': 'uppercase'}],
    ['tt-l', {'text-transform': 'lowercase'}],
    ['tt-c', {'text-transform': 'capitalize'}],
    
    ['va-b',{'vertical-align': 'baseline'}],
    ['va-t',{'vertical-align': 'top'}],
    ['va-m',{'vertical-align': 'middle'}],
    ['va-b',{'vertical-align': 'bottom'}],
    ['va-tb',{'vertical-align': 'text-bottom'}],

    ['tt-t', {'text-transform': 'none'}],
    ['tt-u', {'text-transform': 'uppercase'}],
    ['tt-l', {'text-transform': 'lowercase'}],
    ['tt-c', {'text-transform': 'capitalize'}],

    ['ls-n', {'letter-spacing': 'normal'}],
    ['ls-t', {'letter-spacing': 'tight'}],
    ['ls-w', {'letter-spacing': 'wide'}],

    ['ws-n', {'white-space': 'normal'}],
    ['ws-p', {'white-space': 'pre'}],
    ['ws-nw', {'white-space': 'nowrap'}],
    ['ws-pw', {'white-space': 'pre-wrap'}],
    ['ws-pl', {'white-space': 'pre-line'}],

    ['wh-n', {'word-break': 'normal'}],
    ['wh-b', {'word-break': 'break-all'}],
    ['wh-k', {'word-break': 'keep-all'}],
    ['wh-c', {'word-break': 'break-word'}],

    ['lh-n', {'line-height': 'normal'}],

    ['ww-n', {'word-wrap': 'normal'}],
    ['ww-b', {'word-wrap': 'break-word'}],

    ['jc-s', {'justify-content': 'start'}],
    ['jc-e', {'justify-content': 'end'}],
    ['jc-c', {'justify-content': 'center'}],
    ['jc-l', {'justify-content': 'left'}],
    ['jc-r', {'justify-content': 'right'}],
    ['jc-b', {'justify-content': 'between'}],
    ['jc-a', {'justify-content': 'around'}],
    ['jc-fs', {'justify-content': 'flex-start'}],
    ['jc-fe', {'justify-content': 'flex-end'}],
    ['jc-sb', {'justify-content': 'space-between'}],
    ['jc-se', {'justify-content':'space-evenly'}],
    ['jc-sa', {'justify-content':'space-around'}],

    ['wm-ht', {'writing-mode': 'horizontal-tb'}],
    ['wm-vr', {'writing-mode': 'vertical-rl'}],
    ['wm-vl', {'writing-mode': 'vertical-lr'}],

    ['us-a', {'user-select': 'auto'}],
    ['us-n', {'user-select': 'none'}],
    ['us-t', {'user-select': 'text'}],
    ['us-all', {'user-select': 'all'}],

    // 实现一个规则，当用户可以输入`ts:5-2-4-000` 来设置text-shadow的值为`5px 2px 4px #000`，其中如果第三个值为空，则默认为0, 如果第四个颜色值为空，则默认为 #000
    [/^ts:(-?[0-9]+)-(-?[0-9]+)(?:-([0-9]+))?(?:-([0-9a-fA-F]{3,6}))?$/, ([_, x, y, blur, color]) => ({ 'text-shadow': `${x}px ${y}px ${blur ? blur + 'px' : '0'} ${color ? '#' + color : '#000'}` })],  

]