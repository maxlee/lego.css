export const textDecorationRules = [
    [
        /^td:(\w+)(?:-(\w+))?(?:-(\w+))?$/, 
        ([_, typeShortcut, styleOrColorShortcut, color]) => {
          // 文本装饰类型和样式的缩写映射
          const textDecorationShortcuts = {
            'n': 'none',
            'u': 'underline',
            'o': 'overline',
            'lt': 'line-through'
          };
          const textDecorationStyleShortcuts = {
            's': 'solid',
            'db': 'double',
            'dt': 'dotted',
            'ds': 'dashed',
            'w': 'wavy'
          };
      
          // 常见的CSS颜色名词
          const colorNames = ['red', 'green', 'blue', 'black', 'white', 'gray', 'yellow', 'purple', 'orange'];
      
          // 将缩写转换为完整的文本装饰类型和样式
          let type = textDecorationShortcuts[typeShortcut] || typeShortcut;
          let style = textDecorationStyleShortcuts[styleOrColorShortcut] || styleOrColorShortcut || 'solid';
          let finalColor = '';
      
          // 确认type是否有效
          if (!Object.values(textDecorationShortcuts).includes(type) && !Object.keys(textDecorationShortcuts).includes(typeShortcut)) {
            return { error: `Invalid text decoration type: '${typeShortcut}'.` };
          }
      
          // 分离样式和颜色的逻辑处理
          if (textDecorationStyleShortcuts[styleOrColorShortcut] || !styleOrColorShortcut) {
            // 如果styleOrColorShortcut是有效的样式或未指定，则尝试处理颜色
            if (color && (colorNames.includes(color.toLowerCase()) || /^[0-9a-fA-F]{3,6}$/.test(color))) {
              finalColor = colorNames.includes(color.toLowerCase()) ? color : '#' + color;
            } else if (color) {
              return { error: `Invalid color: '${color}'.` };
            }
          } else {
            // 如果styleOrColorShortcut不是有效的样式，则尝试将其视为颜色
            if (colorNames.includes(styleOrColorShortcut.toLowerCase()) || /^[0-9a-fA-F]{3,6}$/.test(styleOrColorShortcut)) {
              finalColor = colorNames.includes(styleOrColorShortcut.toLowerCase()) ? styleOrColorShortcut : '#' + styleOrColorShortcut;
              style = 'solid'; // 重置为默认样式，因为已经使用了颜色
            } else {
              return { error: `Invalid style or color: '${styleOrColorShortcut}'.` };
            }
          }
      
          // 构建并返回CSS规则
          return { 'text-decoration': `${type} ${style} ${finalColor}`.trim() };
        }
      ]
      
      
  


]