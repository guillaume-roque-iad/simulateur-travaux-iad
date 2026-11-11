/* Fonctionnement hors connexion. Incrémentez VERSION à chaque déploiement. */
const VERSION = "travaux-v1";
const SHELL = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./mentions-legales.html",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
const CDN = ["cdnjs.cloudflare.com", "www.gstatic.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  // Pages et fichiers de l'application : réseau d'abord, cache en secours
  if (url.origin === location.origin) {
    if (url.pathname.startsWith("/__/")) return; // fichiers réservés de Firebase (connexion)
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
    return;
  }
  // Bibliothèques et polices : cache d'abord, mise à jour en arrière-plan
  if (CDN.includes(url.hostname)) {
    e.respondWith(caches.open(VERSION).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
  // Firestore et authentification : jamais interceptés (Firestore gère son propre cache hors connexion)
});
