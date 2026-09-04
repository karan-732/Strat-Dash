/** The deliberately small markdown subset the console's exports use. */
export function mdToHtml(md: string): string {
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const out: string[] = [];
  String(md)
    .split('\n')
    .forEach((raw) => {
      const l = raw.trim();
      if (!l) {
        out.push('');
        return;
      }
      if (/^###\s/.test(l)) return void out.push('<h3>' + esc(l.slice(4)) + '</h3>');
      if (/^##\s/.test(l)) return void out.push('<h2>' + esc(l.slice(3)) + '</h2>');
      if (/^#\s/.test(l)) return void out.push('<h1>' + esc(l.slice(2)) + '</h1>');
      if (/^[-*]\s/.test(l)) return void out.push('<li>' + esc(l.slice(2)) + '</li>');
      if (/^\|/.test(l)) return void out.push('<p style="font-family:monospace">' + esc(l) + '</p>');
      out.push('<p>' + esc(l) + '</p>');
    });
  return out.join('\n').replace(/(<li>[\s\S]*?<\/li>)(?!\n<li>)/g, '<ul>$1</ul>');
}
