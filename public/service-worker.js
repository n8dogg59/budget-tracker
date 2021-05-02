const APP_PREFIX = "Budget-";
const VERSION = "version_02";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./css/styles.css",
  "./js/idb.js",
  "./js/index.js",
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png"
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
// self.addEventListener("fetch", function (e) {
//   if (e.request.url.includes("/api/")) {
//     console.log("fetch request : " + e.request.url);
//     e.respondWith(
//       caches.open(CACHE_NAME).then(function (e) {
//         return fetch(e.request)
//           .then((response) => {
//             if (response.status === 200) {
//               cache.put(e.request.url, response.clone());
//             }
//             return response;
//           })
//           .catch((err) => {
//             return cache.match(e.request);
//           });
//       })
//     );
//     return;
//   } 
//   e.respondWith(
//     fetch(e.request).catch(function() {
//       return caches.match(e.request).then(function(response) {
//         if (response) {
//           return response;
//         } else if (e.request.headers.get("accept").includes("text/html")) {
//           // return the cached home page for all requests for html pages
//           return caches.match("/");
//         }
//       });
//     })
//   );
// });

self.addEventListener('fetch', function (e) {
  console.log('from fetch');
  if (e.request.url.includes('/api/')) {
    console.log('fetch request : ' + e.request.url);
    e.respondWith(
      // caches.open(CACHE_NAME).then(function (e) {
      caches
        .open(CACHE_NAME)
        .then((cache) => {
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
        .catch((err) => console.log('yo' + err)),
    );
    return;
  }
  e.respondWith(
    fetch(e.request).catch(function () {
      return caches.match(e.request).then(function (response) {
        if (response) {
          return response;
        } else if (e.request.headers.get('accept').includes('text/html')) {
          // return the cached home page for all requests for html pages
          return caches.match('/');
        }
      });
    }),
  );
});