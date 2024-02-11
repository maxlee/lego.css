import {boxRules} from './boxRules';
import {textRules} from './textRules';

export const otherRules = [
    ...boxRules,
    ...textRules,

    ['o-h', { overflow: 'hidden' }],
    ['o-v', { overflow: 'visible' }],
    ['ox-h', { 'overflow-x': 'hidden' }],
    ['ox-v', { 'overflow-x': 'visible' }],
    ['oy-h', { 'overflow-y': 'hidden' }],
    ['oy-v', { 'overflow-y': 'visible' }],
    ['v-h', { 'visibility': 'hidden' }],
    ['v-v', { 'visibility': 'visible' }],

    ['p-r', { 'position': 'relative' }],
    ['p-a', { 'position': 'absolute' }],
    ['p-f', { 'position': 'fixed' }],
    ['p-s', { 'position': 'static' }],
    ['p-e', { 'position': 'sticky' }],

    ['r-n', {'resize': 'none'}],
    ['r-b', {'resize': 'both'}],
    ['r-v', {'resize': 'vertical'}],
    ['r-h', {'resize': 'horizontal'}],

    ['c-d',{'cursor': 'default'}],
    ['c-p',{'cursor': 'pointer'}],
    ['c-m',{'cursor': 'move'}],
    ['c-t',{'cursor': 'text'}],
    ['c-h',{'cursor': 'help'}],

    ['f-l',{'float': 'left'}],
    ['f-r',{'float': 'right'}],
    ['f-n',{'float': 'none'}],

];