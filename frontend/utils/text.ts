/**
 * Safe HTML/Text highlighting utility
 */
export const highlightHTML = (html: string, searchTerm: string) => {
  if (!searchTerm || !html) return html;
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const term = searchTerm.toLowerCase();

    const walk = (node: Node) => {
      if (node.nodeType === 3) { // Text node
        const text = node.nodeValue || '';
        if (text.toLowerCase().includes(term)) {
          const parts = text.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
          const span = document.createElement('span');
          parts.forEach(part => {
            if (part && part.toLowerCase() === term) {
              const mark = document.createElement('mark');
              mark.className = 'bg-yellow-200 rounded-sm px-0.5 text-slate-900 border-b border-yellow-400 font-bold';
              mark.textContent = part;
              span.appendChild(mark);
            } else if (part) {
              span.appendChild(document.createTextNode(part));
            }
          });
          node.parentNode?.replaceChild(span, node);
        }
      } else {
        Array.from(node.childNodes).forEach(walk);
      }
    };

    walk(doc.body);
    return doc.body.innerHTML;
  } catch (e) {
    console.error('Highlight failed', e);
    return html;
  }
};
