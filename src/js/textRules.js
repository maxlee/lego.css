export const textRules = [

    [/^c([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(!?)$/, ([_, color, i]) => ({ 'color': `#${color} ${i ? '!important' : ''}` })],

    ['ff-h', {'font-family': '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif'}],
    ['ff-k', {'font-family': 'Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, DFKai-SB, "TW\-Kai", serif'}],
    ['ff-s', {'font-family': 'Georgia, "Nimbus Roman No9 L", "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", "Source Han Serif CN", STSong, "AR PL New Sung", "AR PL SungtiL GB", NSimSun, SimSun, "TW\-Sung", "WenQuanYi Bitmap Song", "AR PL UMing CN", "AR PL UMing HK", "AR PL UMing TW", "AR PL UMing TW MBE", PMingLiU, MingLiU, serif'}],
    ['ff-fs', {'font-family': 'Baskerville, "Times New Roman", "Liberation Serif", STFangsong, FangSong, FangSong_GB2312, "CWTEX\-F", serif'}],

    ['fs:n', {'font-style': 'normal'}],
    ['fs:i', {'font-style': 'italic'}],
    ['fs:o', {'font-style': 'oblique'}],

    ['fv-n', {'font-variant': 'normal'}],
    ['fv-s', {'font-variant': 'small-caps'}],

    ['dir-l', {'direction': 'ltr'}],
    ['dir-r', {'direction': 'rtl'}],

    ['ub-n', {'unicode-bidi': 'normal'}],
    ['ub-e', {'unicode-bidi': 'embed'}],
    ['ub-b', {'unicode-bidi': 'bidi-override'}],

    ['ta-l', {'text-align': 'left'}],
    ['ta-c', {'text-align': 'center'}],
    ['ta-r', {'text-align': 'right'}],
    ['ta-j', {'text-align': 'justify'}],

    ['td-n', {'text-decoration': 'none'}],
    ['td-u', {'text-decoration': 'underline'}],
    ['td-o', {'text-decoration': 'overline'}],
    ['td-l', {'text-decoration': 'line-through'}],
    
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

    ['ta-l', {'text-align': 'left'}],
    ['ta-c', {'text-align': 'center'}],
    ['ta-r', {'text-align': 'right'}],
    ['ta-j', {'text-align': 'justify'}],

    ['td-n', {'text-decoration': 'none'}],
    ['td-u', {'text-decoration': 'underline'}],
    ['td-o', {'text-decoration': 'overline'}],
    ['td-l', {'text-decoration': 'line-through'}],

    ['tt-n', {'text-transform': 'none'}],
    ['tt-u', {'text-transform': 'uppercase'}],
    ['tt-l', {'text-transform': 'lowercase'}],
    ['tt-c', {'text-transform': 'capitalize'}],

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
    ['lh-t', {'line-height': 'tight'}],
    ['lh-w', {'line-height': 'wide'}],

    ['ws-n', {'white-space': 'normal'}],
    ['ws-p', {'white-space': 'pre'}],
    ['ws-nw', {'white-space': 'nowrap'}],
    ['ws-pw', {'white-space': 'pre-wrap'}],
    ['ws-pl', {'white-space': 'pre-line'}],

    ['wh-n', {'word-break': 'normal'}],
    ['wh-b', {'word-break': 'break-all'}],
    ['wh-k', {'word-break': 'keep-all'}],

    ['ww-n', {'word-wrap': 'normal'}],
    ['ww-b', {'word-wrap': 'break-word'}],

    ['tj-a', {'text-justify': 'auto'}],
    ['tj-iw', {'text-justify': 'inter-word'}],
    ['tj-ii', {'text-justify': 'inter-ideograph'}],
    ['tj-ic', {'text-justify': 'inter-cluster'}],
    ['tj-d', {'text-justify': 'distribute'}],
    ['tj-k', {'text-justify': 'kashida'}],
    ['tj-t', {'text-justify': 'tibetan'}],
    ['tj-s', {'text-justify': 'space'}],
    ['tj-r', {'text-justify': 'right'}],

    ['to-n', {'text-overflow': 'clip'}],
    ['to-e', {'text-overflow': 'ellipsis'}],

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