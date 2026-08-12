var CACHE_NAME='gameyard-ps5-offline-v3';
var APP_FILES=[
  './',
  './index.html',
  './offline.appcache',
  './sw.js',
  './offsets/10.00.js',
  './offsets/10.01.js',
  './offsets/10.20.js',
  './offsets/10.40.js',
  './offsets/10.60.js',
  './offsets/11.00.js',
  './offsets/11.20.js',
  './offsets/11.40.js',
  './offsets/11.60.js',
  './offsets/12.00.js',
  './offsets/9.00.js',
  './offsets/9.20.js',
  './offsets/9.40.js',
  './offsets/9.60.js',
  './payloads/elfldr-ps5-1360.elf',
  './payloads/ftpsrv-ps5.elf',
  './payloads/gdbsrv-ps5.elf',
  './payloads/kexp_2026_05_25.bin',
  './payloads/klogsrv-ps5.elf',
  './payloads/kstuff.elf',
  './payloads/shsrv-ps5.elf',
  './payloads/websrv-ps5.elf',
  './slopkit/cat.jpg',
  './slopkit/core.js',
  './slopkit/int64.js',
  './slopkit/main.js',
  './slopkit/mem.js',
  './slopkit/mmhmm-cats-ps5.gif',
  './slopkit/poops.html',
  './slopkit/poops.js',
  './slopkit/rop.js',
  './slopkit/rop_slave.js',
  './slopkit/syscalls.js',
  './ui/payload-ftp-default.png',
  './ui/payload-ftp-failed.png',
  './ui/payload-ftp-sending.png',
  './ui/payload-ftp-sent.png',
  './ui/payload-gdb-default.png',
  './ui/payload-gdb-failed.png',
  './ui/payload-gdb-sending.png',
  './ui/payload-gdb-sent.png',
  './ui/payload-klog-default.png',
  './ui/payload-klog-failed.png',
  './ui/payload-klog-sending.png',
  './ui/payload-klog-sent.png',
  './ui/payload-kstuff-default.png',
  './ui/payload-kstuff-failed.png',
  './ui/payload-kstuff-sending.png',
  './ui/payload-kstuff-sent.png',
  './ui/payload-menu-title.png',
  './ui/payload-shell-default.png',
  './ui/payload-shell-failed.png',
  './ui/payload-shell-sending.png',
  './ui/payload-shell-sent.png',
  './ui/payload-web-default.png',
  './ui/payload-web-failed.png',
  './ui/payload-web-sending.png',
  './ui/payload-web-sent.png',
  './slopkit/core.js?v=10',
  './slopkit/main.js?v=16',
  './slopkit/mem.js?v=10',
  './slopkit/poops.js?v=16',
  './slopkit/poops.html?go=1&auto=1&trigger=netcontrol&payload=1&v=17'
];

self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_FILES);
    }).then(function(){return self.skipWaiting();})
  );
});

self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(key){
        if(key!==CACHE_NAME){return caches.delete(key);}
      }));
    }).then(function(){return self.clients.claim();})
  );
});

self.addEventListener('fetch',function(event){
  if(event.request.method!=='GET'){return;}
  var url=new URL(event.request.url);
  if(url.origin!==self.location.origin){return;}
  event.respondWith(
    caches.match(event.request,{ignoreSearch:false}).then(function(cached){
      if(cached){return cached;}
      return caches.match(event.request,{ignoreSearch:true}).then(function(baseCached){
        if(baseCached){return baseCached;}
        return fetch(event.request).then(function(response){
          if(response&&response.ok){
            var copy=response.clone();
            caches.open(CACHE_NAME).then(function(cache){cache.put(event.request,copy);});
          }
          return response;
        }).catch(function(){
          if(event.request.mode==='navigate'){return caches.match('./index.html');}
          throw new Error('Offline resource unavailable');
        });
      });
    })
  );
});

