import type { Menu } from '@/types';

export function encodeMenuToUrl(menu: Menu): string {
  try {
    const json = JSON.stringify(menu);
    const encoded = btoa(encodeURIComponent(json));
    const url = new URL(window.location.href);
    url.hash = `share=${encoded}`;
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function decodeMenuFromUrl(): Menu | null {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#share=')) return null;
    const encoded = hash.slice(7);
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as Menu;
  } catch {
    return null;
  }
}

export function clearShareFromUrl(): void {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
