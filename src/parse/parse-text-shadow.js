export default function parseTextShadow() {
    return {
        name: 'parse-text-shadow',
        enforce: 'pre',
        transform(code) {
            return code.replace(/ts\[((-?\d*)\s*([-\d]*)\s*(\d*)\s*([#\w\(\),.\s]*))\]/g, (_, content) => {
                // 分割内容并移除空项，然后用破折号连接
                const params = content.split(/\s+/).filter(Boolean).join('-');
                return `ts:${params}`;
            });
        },
    }
}
