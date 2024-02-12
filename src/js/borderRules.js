export const borderRules = [

    [
        /^bd:(\d+)(?:-(\w+))?(?:-(\w{3,6}|\w+))?$/,
        ([_, width, styleOrColor, color]) => {
            let style = 'solid'; // 默认样式
            let finalColor = '#000'; // 默认颜色
            const widthInt = parseInt(width, 10);
            // 定义有效的边框样式列表
            const validStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];

            // 常见的CSS颜色名词
            const colorNames = ['red', 'green', 'blue', 'black', 'white', 'gray', 'yellow', 'purple', 'orange'];
            // 宽度范围限制，例如，1到20像素
            if (isNaN(widthInt) || widthInt < 1 || widthInt > 20) {
                return { error: 'Invalid width. Width must be between 1 and 20.' };
            }

            // 判断styleOrColor是样式、颜色代码还是颜色名词
            if (styleOrColor) {
                if (validStyles.includes(styleOrColor)) {
                    // 如果是有效样式，则直接使用
                    style = styleOrColor;
                } else if (/^[0-9a-fA-F]{3,6}$/.test(styleOrColor) || colorNames.includes(styleOrColor.toLowerCase())) {
                    // 如果符合颜色代码格式或是有效的颜色名词，则作为颜色处理
                    finalColor = colorNames.includes(styleOrColor.toLowerCase()) ? styleOrColor : '#' + styleOrColor;
                } else {
                    // 非有效样式、颜色代码也不是颜色名词，返回错误
                    return { error: 'Invalid style or color.' };
                }
            }

            // 如果指定了颜色参数，并且它是有效的颜色代码或颜色名词
            if (color && (/^[0-9a-fA-F]{3,6}$/.test(color) || colorNames.includes(color.toLowerCase()))) {
                finalColor = colorNames.includes(color.toLowerCase()) ? color : '#' + color;
            } else if (color) {
                // 颜色参数存在但不是有效颜色代码也不是颜色名词
                return { error: 'Invalid color code or name.' };
            }

            // 返回CSS规则
            return { 'border': `${width}px ${style} ${finalColor}` };
        }
    ],



]