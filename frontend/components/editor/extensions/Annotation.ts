import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlightAnnotation: {
      setHighlightAnnotation: (attributes?: { color?: string }) => ReturnType;
      toggleHighlightAnnotation: (attributes?: { color?: string }) => ReturnType;
      unsetHighlightAnnotation: () => ReturnType;
    };
    underlineAnnotation: {
      setUnderlineAnnotation: (attributes?: { color?: string, style?: string, thickness?: string }) => ReturnType;
      toggleUnderlineAnnotation: (attributes?: { color?: string, style?: string, thickness?: string }) => ReturnType;
      unsetUnderlineAnnotation: () => ReturnType;
    };
  }
}

export const HighlightAnnotation = Mark.create({
  name: 'highlightAnnotation',
  priority: 1000,
  addAttributes() {
    return {
      color: {
        default: '#FFFF00',
        parseHTML: element => element.style.backgroundColor || element.getAttribute('data-color') || element.getAttribute('color'),
        renderHTML: attributes => {
          if (!attributes.color) return {};
          return {
            'data-color': attributes.color,
            style: `background-color: ${attributes.color}; color: inherit !important; display: inline !important; margin: 0 !important; padding: 0 !important; line-height: inherit !important; letter-spacing: inherit !important; word-spacing: inherit !important; vertical-align: baseline !important;`,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      setHighlightAnnotation: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      toggleHighlightAnnotation: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      unsetHighlightAnnotation: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
  parseHTML() { 
    return [
      { tag: 'mark[data-annotation-type="highlight"]' },
      { tag: 'span[data-annotation-type="highlight"]' },
      { tag: 'mark' }
    ]; 
  },
  renderHTML({ HTMLAttributes }) { 
    return ['mark', mergeAttributes(HTMLAttributes, { 'data-annotation-type': 'highlight' }), 0]; 
  },
});

export const UnderlineAnnotation = Mark.create({
  name: 'underlineAnnotation',
  priority: 1000,
  addAttributes() {
    return {
      color: {
        default: '#000000',
        parseHTML: element => element.style.textDecorationColor || element.getAttribute('data-color'),
        renderHTML: attributes => {
          if (!attributes.color) return {};
          return { 'data-color': attributes.color };
        },
      },
      style: {
        default: 'solid',
        parseHTML: element => element.style.textDecorationStyle || element.getAttribute('data-style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { 'data-style': attributes.style };
        },
      },
      thickness: {
        default: 'auto',
        parseHTML: element => element.style.textDecorationThickness || element.getAttribute('data-thickness'),
        renderHTML: attributes => {
          if (!attributes.thickness) return {};
          return { 'data-thickness': attributes.thickness };
        },
      }
    };
  },
  addCommands() {
    return {
      setUnderlineAnnotation: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      toggleUnderlineAnnotation: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      unsetUnderlineAnnotation: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
  parseHTML() { 
    return [
      { tag: 'span[data-annotation-type="underline"]' },
      { tag: 'ins[data-annotation-type="underline"]' },
      { tag: 'u' }
    ]; 
  },
  renderHTML({ HTMLAttributes }) { 
    const { color, style, thickness } = HTMLAttributes;
    const styleString = [
      'text-decoration: underline !important',
      `text-decoration-color: ${color || 'currentColor'} !important`,
      `text-decoration-style: ${style || 'solid'} !important`,
      `text-decoration-thickness: ${thickness || 'auto'} !important`,
      'text-underline-offset: 4px !important',
      'display: inline !important',
      'margin: 0 !important',
      'padding: 0 !important',
      'line-height: inherit !important',
      'letter-spacing: inherit !important',
      'word-spacing: inherit !important',
      'vertical-align: baseline !important'
    ].join('; ') + ';';

    return ['span', mergeAttributes(HTMLAttributes, { 
      'data-annotation-type': 'underline',
      style: styleString
    }), 0]; 
  },
});
