export const colorRules = [

    [/^c([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(!?)$/, ([_, color, i]) => ({ 'color': `#${color} ${i ? '!important' : ''}` })],
    [/^bgc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'background-color': `#${color} ${i ? '!important' : ''}` })],
    [/^bc([0-9a-fA-F]{3,6})(!?)$/, ([_, color, i]) => ({ 'border-color': `#${color} ${i ? '!important' : ''}` })],
    
]