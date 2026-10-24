/**
 * Prevent accidentally sending Nexora credentials and requests to an unrelated
 * hosted Supabase project. Local loopback is permitted for disposable CI/DEV.
 * No service-role or secret key belongs in the browser.
 */
const NEXORA_HOST = "cjqlldrxpiwldekxywwa.supabase.co";

export function isNexoraBackendUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return false;
    if (url.protocol === "https:" && url.hostname === NEXORA_HOST && !url.port) return true;
    return (
      url.protocol === "http:" &&
      (url.hostname === "127.0.0.1" || url.hostname === "localhost") &&
      Number(url.port) > 0
    );
  } catch {
    return false;
  }
}
