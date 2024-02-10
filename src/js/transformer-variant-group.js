import { parseVariantGroup } from '@unocss/core'

export default function transformerVariantGroup(options = {}) {
    return {
        name: 'transformerVariantGroup',
        enforce: 'pre',
        transform(s) {
            // 预处理类名
            s = s.replace(/h:\((.*?)\)/g, (match, group) => {
                return group.split(' ').map(item => 'h:' + item).join(' ')
            })

            // 增加支持 a: 和 f:
            s = s.replace(/a:\((.*?)\)/g, (match, group) => {
                return group.split(' ').map(item => 'a:' + item).join(' ')
            })

            s = s.replace(/f:\((.*?)\)/g, (match, group) => {
                return group.split(' ').map(item => 'f:' + item).join(' ')
            })

            const result = parseVariantGroup(s, options.separators)

            return {
                get highlightAnnotations() {
                    return [...result.groupsByOffset.values()].flatMap(group => group.items)
                },
            }
        },
    }
}
// CSS 伪类https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes