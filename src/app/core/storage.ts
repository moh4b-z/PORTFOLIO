export function readLocalStorage(documentRef: Document, key: string): string | null {
  try {
    return documentRef.defaultView?.localStorage.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeLocalStorage(documentRef: Document, key: string, value: string): void {
  try {
    documentRef.defaultView?.localStorage.setItem(key, value);
  } catch {
    // O armazenamento pode falhar em navegação privada ou com política restrita.
  }
}
