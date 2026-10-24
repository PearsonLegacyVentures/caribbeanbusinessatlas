// Canonicalize only the production Pages alias. Preview subdomains stay usable.
// Unlike a static _redirects file, this can inspect the incoming hostname.
const LEGACY_HOST = 'caribbeanbusinessatlas.pages.dev';
const CANONICAL_HOST = 'mag.bahamasaisolutions.com';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === LEGACY_HOST) {
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
