export default function parseTextShadow() {
    return {
        name: 'parse-text-shadow',
        enforce: 'pre',
        transform(code) {
            return code.replace(/ts:\[(-?\d+)(?: (-?\d+))?(?: (-?\d+))?(?: (\w+))?\]/g, (match, offsetX, offsetY = '', blurRadius = '', color = '') => {
              // 如果 blurRadius 为负数，重置为 0
              if (blurRadius < 0) blurRadius = '0';
              return `ts:${offsetX}${offsetY ? '-' + offsetY : ''}${blurRadius ? '-' + blurRadius : ''}${color ? '-' + color : ''}`
            })
        },
    }
}