import { parseVariantGroup } from '@unocss/core'

export default function transformerVariantGroup(options = {}) {
    return {
        name: 'transformerVariantGroup',
        enforce: 'pre',
        transform(s) {
            s = s.replace(/(h|a|f):\((.*?)\)/g, (match, prefix, group) => {
                // 匹配方括号内的内容以及前面可能存在的类名
                const parts = group.match(/([^ \[]+\[[^\]]+\])|([^ ]+!?)/g) || [];
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

            const result = parseVariantGroup ? parseVariantGroup(s, options.separators) : null;

            return {
                get highlightAnnotations() {
                    return result ? [...result.groupsByOffset.values()].flatMap(group => group.items) : [];
                },
            };
        },
    };
}




// CSS 伪类https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes