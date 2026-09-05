const CACHE_NAME = "sopro-magnetico-v2";

const ficheiros = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./logo_sm.png",
    "./icon-192.png",
    "./icon-512.png",
    "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ficheiros);
            })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(nomes => {
                return Promise.all(
                    nomes
                        .filter(nome => nome !== CACHE_NAME)
                        .map(nome => caches.delete(nome))
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
            .then(resposta => {
                const copia = resposta.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(
                            event.request,
                            copia
                        );
                    });

                return resposta;
            })
            .catch(() => {
                return caches.match(
                    event.request
                );
            })
    );
});