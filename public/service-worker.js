const APP_PREFIX = "Budget-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "/index.html",
  "/js/idb.js",
  "/css/styles.css",
  "/js/index.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// self.addEventListener('fetch', function (e) {
//   console.log('Fetch request : ' + e.request.url)
//   e.respondWith(
//     caches.match(e.request).then(function (request) {
//       if (request) {
//         console.log('Responding to app fetch request with cached data: ' + e.request.url)
//         return request
//       } else {
//         console.log('No cache available, fetching from network: ' + e.request.url)
//         return fetch(e.request)
//       }
//     })
//   )
// });

// // Respond with cached resources
self.addEventListener("fetch", function (e) {
  if (e.request.url.includes("/api/transaction")) {
    console.log("fetch request : " + e.request.url);
    e.respondWith(
      caches.open(CACHE_NAME).then(function (e) {
        return fetch(e.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(e.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            return cache.match(e.request);
          });
      })
    );
    return;
  } else 
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((response) => {
        return response || fetch(e.request);
      });
    })
  );
});
