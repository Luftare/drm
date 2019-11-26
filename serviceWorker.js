const STATIC_CACHE_NAME = 'static-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v2';
const retainedCacheNames = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];

const staticAssets = ['/', '/about.html'];

self.addEventListener('install', e => {
  e.waitUntil(cacheStaticAssets());
});

self.addEventListener('activate', e => {
  e.waitUntil(removeObsoleteCaches());
});

self.addEventListener('fetch', e => {
  const response = shouldUseOfflineAPI(e)
    ? generateAPIResponse(e)
    : getCachedResponseWithFetchFallback(e);

  e.respondWith(response);
});

const shouldUseOfflineAPI = e => {
  const isApiRequest = e.request.url.includes('/hard-coded-api/');
  const offline = !navigator.onLine;
  return offline && isApiRequest;
};

const generateAPIResponse = async e => {
  const instruments = await getCachedInstruments();

  const response = {
    instruments,
  };

  return new Response(JSON.stringify(response));
};

const getCachedResponseWithFetchFallback = async e => {
  const cachedResult = await caches.match(e.request);
  if (cachedResult) return cachedResult;

  return fetchAndCacheResponse(e);
};

const cacheStaticAssets = () =>
  caches.open(STATIC_CACHE_NAME).then(cache => {
    cache.addAll(staticAssets);
  });

const removeObsoleteCaches = async () => {
  const cacheKeys = await caches.keys();
  const deletePromises = cacheKeys
    .filter(cacheName => !retainedCacheNames.includes(cacheName))
    .map(cacheName => caches.delete(cacheName));

  return Promise.all(deletePromises);
};

const isAudioFile = url => url.includes('.wav');

const isCompleteInstrument = (name, _, instruments) =>
  instruments.filter(instName => instName === name).length === 4;

const fileNameToInstrumentName = fileName => fileName.split('-')[0];

const unique = (name, i, names) => names.indexOf(name) === i;

const urlToFileName = url => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

const requestUrlsToCompleteInstruments = urls =>
  urls
    .filter(isAudioFile)
    .map(urlToFileName)
    .map(fileNameToInstrumentName)
    .filter(isCompleteInstrument)
    .filter(unique)
    .filter(Boolean);

const getCachedInstruments = async () => {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedRequests = await cache.keys();
  const cachedRequestUrls = cachedRequests.map(({ url }) => url);
  return requestUrlsToCompleteInstruments(cachedRequestUrls);
};

const getCachedResponse = async e => {
  return await caches.match(e.request);
};

const fetchAndCacheResponse = async e => {
  const fetchResponse = await fetch(e.request);
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  cache.put(e.request.url, fetchResponse.clone());
  return fetchResponse;
};
