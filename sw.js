var CACHE_NAME = 'gameyard-w90008-complete-v11';
var APP_FILES = [
  "./",
  "./index.html",
  "./offline.appcache",
  "./sw.js",
  "./.nojekyll",
  "./README.md",
  "./appcache_manifest_generator.py",
  "./cache.manifest",
  "./document/en/ps5/index.html",
  "./gameyard-logo.jpeg",
  "./offsets/10.00.js",
  "./offsets/10.01.js",
  "./offsets/10.20.js",
  "./offsets/10.40.js",
  "./offsets/10.60.js",
  "./offsets/11.00.js",
  "./offsets/11.20.js",
  "./offsets/11.40.js",
  "./offsets/11.60.js",
  "./offsets/12.00.js",
  "./offsets/9.00.js",
  "./offsets/9.20.js",
  "./offsets/9.40.js",
  "./offsets/9.60.js",
  "./payloads/5%3DLapy-JB-Daemon_v1.2.elf",
  "./payloads/Lapy-JB-Daemon.elf",
  "./payloads/Lapy-JB-Daemon_v1.2.elf.elf",
  "./payloads/PIZZA-HEN-v0.1.elf",
  "./payloads/ShadowMountPlus%201.7alpha5.elf",
  "./payloads/ShadowMountPlus_1.7alpha5.elf",
  "./payloads/elfldr-ps5-1360.elf",
  "./payloads/ftpsrv-ps5.elf",
  "./payloads/gdbsrv-ps5.elf",
  "./payloads/kexp_2026_05_25.bin",
  "./payloads/klogsrv-ps5.elf",
  "./payloads/kstuff.elf",
  "./payloads/np-fake-signin-ps5.elf",
  "./payloads/ps5-backpork.elf",
  "./payloads/shsrv-ps5.elf",
  "./payloads/web-file-mgr-v1.1.elf",
  "./payloads/websrv-ps5.elf",
  "./poops.html",
  "./poops.js",
  "./readme.png",
  "./slopkit/cat.jpg",
  "./slopkit/core.js",
  "./slopkit/int64.js",
  "./slopkit/main.js",
  "./slopkit/mem.js",
  "./slopkit/mmhmm-cats-ps5.gif",
  "./slopkit/poops.html",
  "./slopkit/poops.js",
  "./slopkit/rop.js",
  "./slopkit/rop_slave.js",
  "./slopkit/syscalls.js",
  "./ui/payload-JBDaemon-default.png",
  "./ui/payload-JBDaemon-failed.png",
  "./ui/payload-JBDaemon-sending.png",
  "./ui/payload-JBDaemon-sent.png",
  "./ui/payload-SMP-default.png",
  "./ui/payload-SMP-failed.png",
  "./ui/payload-SMP-sending.png",
  "./ui/payload-SMP-sent.png",
  "./ui/payload-backpork-default.png",
  "./ui/payload-backpork-failed.png",
  "./ui/payload-backpork-sending.png",
  "./ui/payload-backpork-sent.png",
  "./ui/payload-ftp-default.png",
  "./ui/payload-ftp-failed.png",
  "./ui/payload-ftp-sending.png",
  "./ui/payload-ftp-sent.png",
  "./ui/payload-gdb-default.png",
  "./ui/payload-gdb-failed.png",
  "./ui/payload-gdb-sending.png",
  "./ui/payload-gdb-sent.png",
  "./ui/payload-klog-default.png",
  "./ui/payload-klog-failed.png",
  "./ui/payload-klog-sending.png",
  "./ui/payload-klog-sent.png",
  "./ui/payload-kstuff-default.png",
  "./ui/payload-kstuff-failed.png",
  "./ui/payload-kstuff-sending.png",
  "./ui/payload-kstuff-sent.png",
  "./ui/payload-menu-title.png",
  "./ui/payload-np-default.png",
  "./ui/payload-np-failed.png",
  "./ui/payload-np-sending.png",
  "./ui/payload-np-sent.png",
  "./ui/payload-ph-default.png",
  "./ui/payload-ph-failed.png",
  "./ui/payload-ph-sending.png",
  "./ui/payload-ph-sent.png",
  "./ui/payload-shell-default.png",
  "./ui/payload-shell-failed.png",
  "./ui/payload-shell-sending.png",
  "./ui/payload-shell-sent.png",
  "./ui/payload-web-default.png",
  "./ui/payload-web-failed.png",
  "./ui/payload-web-sending.png",
  "./ui/payload-web-sent.png",
  "./ui/payload-webfile-default.png",
  "./ui/payload-webfile-failed.png",
  "./ui/payload-webfile-np.png",
  "./ui/payload-webfile-sending.png",
  "./ui/payload-webfile-sent.png",
  "./ui/payload-wfilemgr-default.png",
  "./ui/payload-wfilemgr-failed.png",
  "./ui/payload-wfilemgr-sending.png",
  "./ui/payload-wfilemgr-sent.png",
  "./slopkit/poops.html?go=1&auto=1&trigger=netcontrol&payload=1&v=17",
  "./slopkit/main.js?v=16",
  "./slopkit/core.js?v=10",
  "./slopkit/mem.js?v=10",
  "./slopkit/poops.js?v=16",
  "./offsets/10.00.js?v=16",
  "./offsets/10.01.js?v=16",
  "./offsets/10.20.js?v=16",
  "./offsets/10.40.js?v=16",
  "./offsets/10.60.js?v=16",
  "./offsets/11.00.js?v=16",
  "./offsets/11.20.js?v=16",
  "./offsets/11.40.js?v=16",
  "./offsets/11.60.js?v=16",
  "./offsets/12.00.js?v=16",
  "./offsets/9.00.js?v=16",
  "./offsets/9.20.js?v=16",
  "./offsets/9.40.js?v=16",
  "./offsets/9.60.js?v=16"
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(APP_FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      var url = new URL(event.request.url);
      return caches.match(url.origin + url.pathname).then(function (pathCached) {
        if (pathCached) return pathCached;
        return fetch(event.request).then(function (response) {
          if (response && response.status === 200 && response.type !== 'opaque') {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        });
      });
    })
  );
});
