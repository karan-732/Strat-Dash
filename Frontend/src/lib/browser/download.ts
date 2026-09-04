/** Trigger a client-side download of generated text (markdown, .doc, JSON). */
export function download(name: string, text: string, mime?: string): void {
  const a = document.createElement('a');
  const url = URL.createObjectURL(new Blob([text], { type: mime || 'text/plain;charset=utf-8' }));
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/** Download a file the user attached in this session (kept out of the store). */
export function downloadBlob(name: string, blob: Blob): void {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
