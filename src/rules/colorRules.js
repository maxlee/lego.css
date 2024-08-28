export const colorRules = [
    [
        /^(bgc|tdc|bdc|c)(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})|[a-zA-Z]+)(!?)$/,
        ([_, prefix, color, i]) => {
            const isHexColor = color.startsWith('#');
            const isValidHex = isHexColor && (color.length === 4 || color.length === 7);
            const isValidColorName = !isHexColor && /^[a-zA-Z]+$/.test(color);
            
            if (!isValidHex && !isValidColorName) {
                throw new Error('Invalid color format');
            }
    
            let property;
            switch (prefix) {
                case 'bgc':
                    property = 'background-color';
                    break;
                case 'tdc':
                    property = 'text-decoration-color';
                    break;
                case 'bdc':
                    property = 'border-color';
                    break;
                case 'c':
                    property = 'color';
                    break;
                default:
                    throw new Error('Invalid prefix');
            }
    
            return { [property]: `${color}${i ? " !important" : ""}` };
        },
    ]
];
