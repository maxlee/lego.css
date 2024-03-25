export default function parseBorder() {
    return {
        name: 'parse-border',
        enforce: 'pre',
        transform(code) {
            // 使用正则表达式匹配方括号内的可选参数
            return code.replace(/(bd|ol|bdb|bdt|bdl|bdr)\[((\d+)?(\s+\w+)?(\s+[0-9a-fA-F]{3,6})?)\]/g, (_, prefix, content) => {
                // 将匹配到的内容按空格分割，移除空字符串，然后用"-"连接
                const result = content.split(/\s+/).filter(Boolean).join('-');
                // 如果结果为空（即没有参数），直接返回前缀；否则，返回转换后的字符串
                return result ? `${prefix}:${result}` : `${prefix}`;
            });
        }
    }
}