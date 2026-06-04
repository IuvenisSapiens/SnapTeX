import katex from 'katex';
import { RenderContext } from './types';
import { escapeHtmlAttribute } from './utils';

export function renderMath(tex: string, displayMode: boolean, renderer: RenderContext): string {
    try {
        const html = katex.renderToString(tex, {
            displayMode: displayMode,
            macros: renderer.currentMacros,
            throwOnError: false,
            errorColor: '#cc0000',
            globalGroup: true,
            trust: true
        });
        return renderer.protect('math', html);
    } catch (e) {
        return renderer.protect('math', `<span style="color:red">Math Error</span>`);
    }
}

export function createRefLink(key: string, renderer: RenderContext, type: 'ref' | 'eqref' = 'ref'): string {
    const safeKey = escapeHtmlAttribute(key);
    const html = `<a href="#${safeKey}" class="sn-ref" data-key="${safeKey}" style="color:inherit; text-decoration:none;">?</a>`;
    const token = renderer.protect('ref', html);
    if (type === 'eqref') {
        return `(\\text{${token}})`;
    }
    return `\\text{${token}}`;
}

export function recoverPreservedTokens(text: string): string {
    const tokenRegex = /XSNAP:[a-zA-Z0-9_-]+:\d+Y/g;
    let found = "";
    let match;
    while ((match = tokenRegex.exec(text)) !== null) {
        found += match[0];
    }
    return found;
}

export function unwrapResizeboxAroundProtectedContent(text: string): string {
    return text.replace(
        /\\resizebox\s*\{[^{}]*\}\s*\{[^{}]*\}\s*\{\s*((?:XSNAP:[a-zA-Z0-9_-]+:\d+Y\s*)+)\}/g,
        (_match, protectedContent: string) => protectedContent.trim()
    );
}
