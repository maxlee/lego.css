export const listRules = [

    ['ls-n', {'list-style': 'none'}],
    ['ls-s', {'list-style': 'square'}],
    ['ls-d', {'list-style':'disc'}],
    ['ls-i', {'list-style':'inside'}],

    ['lsp-i', {'list-style-position':'inside'}],
    ['lsp-o', {'list-style-position':'outside'}],

    ['lsi-n', {'list-style-image':'none'}],

    ['lst-d', {'list-style-type':'disc'}],
    ['lst-c', {'list-style-type':'circle'}],
    ['lst-s', {'list-style-type':'square'}],
    ['lst-dc', {'list-style-type':'decimal'}],

    [/^lsi\((.*?)\)$/, ([_, url]) => ({ 'list-style-image': `url('${url}')` })],
    
]  