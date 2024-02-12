export const backgroundRules = [

    ['bga-f', { 'background-attachment':'fixed'}],
    ['bga-l', { 'background-attachment':'local'}],
    ['bga-s', { 'background-attachment':'scroll'}],

    ['bgp-t', { 'background-position':'top'}],
    ['bgp-b', { 'background-position':'bottom'}],
    ['bgp-l', { 'background-position':'left'}],
    ['bgp-r', { 'background-position':'right'}],
    ['bgp-c', { 'background-position':'center'}],

    ['bgr-r', { 'background-repeat':'repeat'}],
    ['bgr-n', { 'background-repeat':'no-repeat'}],
    ['bgr-x', { 'background-repeat':'repeat-x'}],
    ['bgr-y', { 'background-repeat':'repeat-y'}],

    ['bgs-a', { 'background-size':'auto'}],
    ['bgs-ct', { 'background-size':'contain'}],
    ['bgs-cv', { 'background-size':'cover'}],
    ['bgs-x', { 'background-size':'100% auto'}],
    ['bgs-y', { 'background-size':'auto 100%'}],
    ['bgs-xy', { 'background-size':'100% 100%'}],

    [/^bgi-(.+)$/, ([_, url]) => ({ 'background-image': `url('${url}')` })], 
    
    [/^bgc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'background-color': `#${color} ${i ? '!important' : ''}` })],
]