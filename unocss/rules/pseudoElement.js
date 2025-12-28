// 处理不同伪元素的函数
const pseudoElementTransformers = [
    {
        prefix: 'fl::', // first-letter
        selector: '::first-letter',
    },
    {
        prefix: 'a::', // after
        selector: '::after',
    },
    {
        prefix: 'b::', // before
        selector: '::before',
    },
    {
        prefix: 'ln::', // first-line
        selector: '::first-line',
    },
    {
        prefix: 'm::', // marker
        selector: '::marker',
    },
    {
        prefix: 'p::', // placeholder
        selector: '::placeholder',
    },
    {
        prefix: 's::', // selection
        selector: '::selection',
    },
    // 可以根据需要继续添加更多伪元素
];

// 创建一个通用的匹配器处理函数
function createPseudoElementMatcher({ prefix, selector }) {
    return (matcher) => {
        if (!matcher.startsWith(prefix)) return matcher;
        return {
            matcher: matcher.slice(prefix.length),
            selector: s => `${s}${selector}`,
        };
    };
}

export const pseudoElementRules = pseudoElementTransformers.map(createPseudoElementMatcher);