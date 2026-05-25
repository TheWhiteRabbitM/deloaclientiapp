const CACHE_NAME = 'deloa-pwa-v3';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './i18n.js',
    './manifest.json',
    './deloa.png',
    './icon-192.png',
    './icon-512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    if (event.request.url.includes('deloaenergy.it/wp-json')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                if (response.ok && event.request.url.startsWith(self.location.origin)) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                    });
                }
                return response;
            }).catch(() => cached);
        })
    );
});

self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'refresh-prices') {
        event.waitUntil(refreshPrices());
    }
});

async function refreshPrices() {
    try {
        const response = await fetch('https://deloaenergy.it/wp-json/wp/v2/pages/2719');
        if (!response.ok) return;
        const page = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(page.content.rendered, 'text/html');
        const items = doc.querySelectorAll('.deloa-item');
        const prices = [];
        items.forEach((item) => {
            const ora = item.querySelector('.ora')?.textContent.trim();
            const prezzo = item.querySelector('.prezzo')?.textContent.trim();
            if (ora && prezzo) {
                const hour = parseInt(ora.split(':')[0], 10);
                const priceStr = prezzo.replace(/[^\d,]/g, '').replace(',', '.');
                const price = parseFloat(priceStr);
                if (!isNaN(price)) prices.push({ hour, price });
            }
        });

        if (prices.length > 0) {
            const currentHour = new Date().getHours();
            const currentPrice = prices.find(p => p.hour === currentHour);
            const avgPrice = prices.reduce((s, p) => s + p.price, 0) / prices.length;

            if (currentPrice && currentPrice.price < avgPrice * 0.7) {
                self.registration.showNotification('Deloa Energy - Ora conveniente!', {
                    body: `Prezzo: ${currentPrice.price.toFixed(3)} €/kWh. Usa ora gli elettrodomestici!`,
                    icon: './icon-192.png',
                    tag: 'cheap-hour',
                });
            } else if (currentPrice && currentPrice.price > avgPrice * 1.4) {
                self.registration.showNotification('Deloa Energy - Ora costosa', {
                    body: `Prezzo: ${currentPrice.price.toFixed(3)} €/kWh. Evita elettrodomestici energivori.`,
                    icon: './icon-192.png',
                    tag: 'expensive-hour',
                });
            }
        }
    } catch (e) {
        console.error('Background refresh failed:', e);
    }
}
