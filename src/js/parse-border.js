export default function parseBorder() {
    return {
        name: 'parse-border',
        enforce: 'pre',
        transform(code) {
            return code.replace(/bd:\[(\S+)(\s\S+)?(\s\S+)?\]/g, (_, p1, p2 = '', p3 = '') => {
              const result = [p1, p2.trim(), p3.trim()].filter(Boolean).join('-')
              return `bd:${result}`
            })
        }
    }
}