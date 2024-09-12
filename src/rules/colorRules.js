export const colorRules = [
    [
        /^(c|bdc|bdtc|bdrc|bdbc|bdlc|bgc|tdc|olc)(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})|[a-zA-Z]+)(!?)$/,
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
                case 'bdtc':
                    property = 'border-top-color';
                    break;
                case 'bdrc':
                    property = 'border-right-color';
                    break;
                case 'bdbc':
                    property = 'border-bottom-color';
                    break;
                case 'bdlc':
                    property = 'border-left-color';
                    break;
                case 'olc':
                    property = 'outline-color';
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
