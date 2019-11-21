const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = ['/about.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

function getCachedInstruments() {
  return new Promise(res => {
    caches.open(dynamicCacheName).then(cache => {
      cache.keys().then(keys => {
        const instruments = keys
          .map(key => key.url)
          .filter(url => url.includes('.wav'))
          .map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1];
          })
          .map(fileName => fileName.split('-')[0]);

        const cachedInstruments = instruments
          .filter(
            (name, _, instruments) =>
              instruments.filter(instName => instName === name).length === 4
          )
          .filter((name, i, names) => names.indexOf(name) === i);

        res(cachedInstruments);
      });
    });
  });
}

const createInstrumentsResponse = async () => {
  const instruments = await getCachedInstruments();

  const response = {
    instruments,
  };

  return new Response(JSON.stringify(response));
};

const getCachedResponse = async e => {
  return await caches.match(e.request);
};

const fetchAndCacheResponse = async e => {
  const fetchResponse = await fetch(e.request);
  const cache = await caches.open(dynamicCacheName);
  cache.put(e.request.url, fetchResponse.clone());
  return fetchResponse;
};

const getCachedResponseWithFetchFallback = async e => {
  const cachedResult = await caches.match(e.request);
  if (cachedResult) return cachedResult;

  return fetchAndCacheResponse(e);
};

self.addEventListener('fetch', async e => {
  const isApiRequest = e.request.url.includes('/hard-coded-api/');
  const offline = !navigator.onLine;
  const useCachedApi = offline && isApiRequest;

  if (useCachedApi) {
    e.respondWith(createInstrumentsResponse());
    return;
  }

  e.respondWith(getCachedResponseWithFetchFallback(e));
});
