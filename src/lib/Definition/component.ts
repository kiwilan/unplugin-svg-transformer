export default `
import * as vue from 'vue';
import { PropType } from 'vue';
import React from 'react';

type Display = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'none' | 'grid' | 'inline-grid' | 'contents' | 'flow' | 'flow-root' | 'table' | 'table-row' | 'table-cell' | false;

declare const VueSvg: vue.DefineComponent<{
    name: {
        type: PropType<string>;
        required: true;
    };
    display: {
        type: PropType<Display>;
        required: false;
        default: string;
    };
}, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    name: {
        type: PropType<string>;
        required: true;
    };
    display: {
        type: PropType<Display>;
        required: false;
        default: string;
    };
}>>, {
    display: Display;
}, {}>;

interface Props {
    className?: string;
    style?: React.CSSProperties;
    name: string;
    display?: Display;
}
declare function ReactSvg({ className, style, name, display }: Props): JSX.Element;

export { ReactSvg, VueSvg };
`
