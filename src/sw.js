const cacheName = 'v4';

const cacheAssets = [
    '../index.html',
    '../dist/people.js',
    '../dist/styles.css',
    '../dist/images/bg.jpg',
    '../dist/images/book.png',
    '../dist/images/cover.jpg',
    '../dist/images/minobr.png',
    '../dist/images/top-glava1.jpg',
    '../dist/images/top-glava2.jpg',
    '../dist/images/top-glava3.jpg'
];

self.addEventListener('install', (e)=> {
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                cache.addAll(cacheAssets);
            })
            .then(()=> self.skipWaiting())

    )
});

self.addEventListener('activate', (e)=> {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(res => {
                if (!res.ok) {
                    throw new TypeError('Bad response status');
                }

                const clone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, clone)
                    });

                return res;
            })
            .catch(function() {
                return caches.match(e.request);
            })
    )
});