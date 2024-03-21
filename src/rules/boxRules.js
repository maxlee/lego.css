export const boxRules = [

    ['wa', { width: 'auto' }],
    ['ha', { height: 'auto' }],
    ['w%', { width: '100%' }],
    ['h%', { height: '100%' }],
    ['ma', { margin: 'auto' }],
    ['pa', { padding: 'auto' }],

    ['d-b', { 'display': 'block' }],
    ['d-i', { 'display': 'inline' }],
    ['d-f', { 'display': 'flex' }],
    ['d-g', { 'display': 'grid' }],
    ['d-ib', { 'display': 'inline-block' }],
    ['d-n', { 'display': 'none' }],

    ['bs-b', {'box-sizing': 'border-box'}],
    ['bs-c', {'box-sizing': 'content-box'}],

    ['bds-n', {'border-style':'none'}],
    ['bds-h', {'border-style':'hidden'}],
    ['bds-d', {'border-style':'dotted'}],
    ['bds-d', {'border-style':'dashed'}],
    ['bds-s', {'border-style':'solid'}],
    ['bds-d', {'border-style':'double'}],
    ['bds-g', {'border-style':'groove'}],
    ['bds-r', {'border-style':'ridge'}],
    ['bds-i', {'border-style':'inset'}],
    ['bds-o', {'border-style':'outset'}],

    ['bd-n', {'border':'0 none'}],

    [/^bc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'border-color': `#${color} ${i ? '!important' : ''}` })],
    // 如果是 s100 则输出 width: 100px 和 height: 100px，如果后面有 ! 则输出 !important
    // [/^s(\d+)(!?)$/, ([_, size, i]) => ({ 'width': `${size}px ${i ? '!important' : ''}`, 'height': `${size}px ${i ? '!important' : ''}` })],
    
]