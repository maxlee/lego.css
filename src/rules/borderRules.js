export const borderRules = [
    [
        /^(bd|ol|bdb|bdt|bdl|bdr):(\d+)(?:-([a-zA-Z]+))?(?:-([a-zA-Z0-9#]+))?$/,
        ([_, type, width, styleOrColor, color]) => {
            const widthInt = parseInt(width, 10);
            if (isNaN(widthInt) || widthInt < 1 || widthInt > 20) {
                return {
                    error: `Invalid width. Width must be between 1 and 20.`,
                };
            }

            // 映射简写到完整CSS属性
            const propertyMap = {
                bd: "border",
                ol: "outline",
                bdb: "border-bottom",
                bdt: "border-top",
                bdl: "border-left",
                bdr: "border-right",
            };
            const property = propertyMap[type];

            // 样式的缩写映射
            const styleShortcuts = {
                s: "solid",
                ds: "dashed",
                dt: "dotted",
                db: "double",
                g: "groove",
                r: "ridge",
                i: "inset",
                o: "outset",
            };
            const validStyles = Object.values(styleShortcuts).concat(
                Object.keys(styleShortcuts)
            );

            // 尝试将输入转换为完整样式
            let style = styleShortcuts[styleOrColor] || styleOrColor;
            if (!validStyles.includes(style)) {
                // 如果styleOrColor不是有效的样式，则尝试将其视为颜色
                style = "solid"; // 重置为默认样式，仅当后续颜色验证失败时返回错误
            }

            // 处理颜色
            let finalColor = "transparent"; // 默认颜色设为透明
            let potentialColor = color || styleOrColor;

            if (
                /^#[0-9a-fA-F]{3}$/.test(potentialColor) ||
                /^#[0-9a-fA-F]{6}$/.test(potentialColor)
            ) {
                // 如果是以 # 开头的 3 位或 6 位十六进制颜色值
                finalColor = potentialColor;
            } else if (/^[a-zA-Z]+$/.test(potentialColor)) {
                // 如果是纯字母的颜色名称
                finalColor = potentialColor.toLowerCase();
            }

            return { [property]: `${width}px ${style} ${finalColor}`.trim() };
        },
    ],
];
