/**
 * 创建一个变换器，用于处理变体组的文本转换
 * 
 * @param {Object} options 可选的配置对象，默认为空对象
 * @returns {Object} 返回一个包含名称、执行时机和转换函数的对象
 */
export function transformerVariantGroup(options = {}) {
    // 返回变换器配置对象
    return {
        // 变换器的名称
        name: 'transformerVariantGroup',
        // 设置执行时机为预处理
        enforce: 'pre',
        /**
         * 执行文本转换的函数
         * 将匹配到的模式根据特定规则进行替换
         * 
         * @param {string} s 要转换的字符串
         * @returns {string} 转换后的字符串
         */
        transform(s) {
            // 使用正则表达式替换匹配到的模式
            s = s.replace(/(h|a|f):\((.*?)\)/g, (match, prefix, group) => {
                // 匹配方括号内的内容以及前面可能存在的类名
                const parts = group.match(/([^ \[]+\[[^\]]+\])|([^ ]+!?)/g) || [];
                // 对每部分进行处理，添加前缀
                return parts.map(part => {
                    // 如果部分匹配到类名和方括号内的内容
                    if (/\[.*\]/.test(part)) {
                        // 分离类名和方括号内的内容
                        const [fullMatch, className, bracketContent] = part.match(/([^ \[]+)(\[[^\]]+\])/);
                        // 去除方括号，并将方括号内的空格替换为破折号
                        const contentWithoutBrackets = bracketContent.slice(1, -1).replace(/\s+/g, '-');
                        return `${prefix}:${className}:${contentWithoutBrackets}`;
                    }
                    // 对于非方括号内的内容，直接添加前缀
                    return `${prefix}:${part}`;
                }).join(' ');
            });

            // 调用外部函数parseVariantGroup解析结果，如果可用
            const result = parseVariantGroup ? parseVariantGroup(s, options.separators) : null;

            // 返回包含highlightAnnotations getter的对象
            return {
                /**
                 * 获取高亮注释数组
                 * 当解析结果可用时，返回解析结果中的所有组的项
                 * 
                 * @returns {Array} 高亮注释数组
                 */
                get highlightAnnotations() {
                    return result ? [...result.groupsByOffset.values()].flatMap(group => group.items) : [];
                },
            };
        },
    };
}