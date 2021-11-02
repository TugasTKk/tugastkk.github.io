// const CACHE_NAME = "CachePertamina222";
// var urlsToCache = [
//   "./",
//   "./nav.html",
//   "./index.html",
//   "./pages/charts.html",
//   "./pages/dashboard.html",
//   "./pages/login.html",
//   "./pages/mobil2.html",
//   "./pages/mobil1.html",
//   "./assets/css/login.css",
//   "./assets/css/sb-admin-2.min.css",
//   "./assets/js/api.js",
//   "./assets/js/chart.js",
//   "./assets/js/sb-admin-2.min.js",
//   "./assets/js/nav.js",
//   "./assets/js/daftar.js",
//   "./assets/img/logo-1.png",
//   "./assets/img/logoKecil.png",
//   "./assets/img/logoKecil2.png",
//   "./assets/img/undraw_posting_photo.svg",
//   "./assets/img/undraw_profile_1.svg",
//   "./assets/img/undraw_profile_2.svg",
//   "./assets/img/undraw_profile_3.svg",
//   "./assets/img/undraw_profile.svg",
//   "./assets/img/undraw_rocket.svg",
//   "./assets/vendor/jquery/jquery.min.js",
//   "./assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
//   "./assets/vendor/jquery-easing/jquery.easing.min.js",
//   "./assets/vendor/datatables/jquery.dataTables.min.js",
//   "./assets/vendor/datatables/dataTables.bootstrap4.min.js",
//   "./assets/vendor/chart.js/Chart.min.js",
//   "./assets/vendor/fontawesome-free/css/all.min.css",
//   "./assets/vendor/fontawesome-free/webfonts/fa-solid-900.woff2",
//   "./assets/vendor/datatables/dataTables.bootstrap4.min.css",
//   "./assets/vendor/fontawesome-free/webfonts/fa-solid-900.woff",
//   "./assets/vendor/fontawesome-free/webfonts/fa-solid-900.ttf",
//   "./manifest.json",
//   "./manifestPush.json",
//   "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
//   "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
// ];
 
// self.addEventListener("install", function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addEventListener("fetch", function(event) {
//     var base_url = "http://localhost:8080/";
//     if (event.request.url.indexOf(base_url) > -1) {
//       event.respondWith(
//         caches.open(CACHE_NAME).then(function(cache) {
//           return fetch(event.request).then(function(response) {
//             cache.put(event.request.url, response.clone());
//             return response;
//           })
//         })
//       );
//     } else {
//       event.respondWith(
//         caches.match(event.request).then(function(response) {
//           return response || fetch (event.request);
//         })
//       )
//     }
// });

// self.addEventListener("activate", function(event) {
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         return Promise.all(
//           cacheNames.map(function(cacheName) {
//             if (cacheName != CACHE_NAME) {
//               console.log("ServiceWorker: cache " + cacheName + " dihapus");
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//     );
// });

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    requireInteraction: true,
    icon: './assets/img/logo-1.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    'actions': [
        {
            'action': 'yes-action',
            'title': 'Action',
        },
        {
            'action': 'no-action',
            'title': 'Dismiss',
        }
    ]
  };
  event.waitUntil(
    self.registration.showNotification('Notifikasi Mobil', options)
  );
});

self.addEventListener('notificationclick', function (event) {
  if (!event.action) {
    // Penguna menyentuh area notifikasi diluar action
    console.log('Notification Click.');
    return;
  }
  
  switch (event.action) {
    case 'yes-action':
      console.log('Pengguna memilih action yes.');
      // console.log(event.title);
      // buka tab baru
      // console.log(event);
      clients.openWindow(`/form.html?body=${event.notification.body}`);
      break;
    case 'no-action':
      console.log('Pengguna memilih action no');
      break;
    default:
      console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
      break;
  }
});