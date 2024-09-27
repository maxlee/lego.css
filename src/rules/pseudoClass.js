// 处理不同伪元素的函数
const pseudoClassTransformers = [
    {
        prefix: 'h:',
        selector: ':hover',
    },
    {
        prefix: 'f:',
        selector: ':focus',
    },
    {
        prefix: 'a:',
        selector: ':active',
    },
    // 可以根据需要继续添加更多伪类
];

// 创建一个通用的匹配器处理函数
function createPseudoClassMatcher({ prefix, selector }) {
    return (matcher) => {
        if (!matcher.startsWith(prefix)) return matcher;
        return {
            matcher: matcher.slice(prefix.length),
            selector: s => `${s}${selector}`,
        };
    };
}

export const pseudoClassRules = pseudoClassTransformers.map(createPseudoClassMatcher);