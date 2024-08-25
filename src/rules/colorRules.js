export const colorRules = [
    [
        /^c([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(!?)$/,
        ([_, color, i]) => ({ color: `#${color} ${i ? "!important" : ""}` }),
    ],
    [
        /^bgc((?:[0-9a-fA-F]{3,6})|(?:red|green|blue|yellow|purple|orange|black|white|gray))(!?)$/,
        ([_, color, important]) => ({
            "background-color": `${
                /^[0-9a-fA-F]{3,6}$/.test(color) ? "#" : ""
            }${color}${important ? " !important" : ""}`,
        }),
    ],
    [
        /^tdc(?:([0-9a-fA-F]{3,6})|([a-zA-Z]+))(!?)$/,
        ([_, hexColor, colorName, i]) => {
            const color = hexColor ? `#${hexColor}` : colorName;
            return {
                "text-decoration-color": `${color}${i ? " !important" : ""}`,
            };
        },
    ],
];
