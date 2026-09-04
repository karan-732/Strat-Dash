import { mdToHtml } from '@/lib/markdown/to-html';

/** A single deliverable, wrapped as a Word-openable HTML document. */
export function wrapDoc(title: string, bodyMd: string): string {
  return (
    '<html><head><meta charset="utf-8"><title>' +
    title +
    '</title><style>body{font-family:Georgia,serif;max-width:44em;margin:3em auto;line-height:1.55;color:#100F0E}' +
    'h1,h2,h3{font-family:Arial,Helvetica,sans-serif;letter-spacing:-.01em}' +
    'h1{border-bottom:2px solid #D26B51;padding-bottom:.3em}h2{margin-top:1.8em}li{margin:.25em 0}' +
    '</style></head><body>' +
    mdToHtml(bodyMd) +
    '</body></html>'
  );
}
