var CACHE_NAME='gameyard-offline-v2';
var REMOTE_BASE='https://w90008.github.io/-/';
var APP_SHELL=['./','./index.html','./offline.appcache'];
var REMOTE_ASSETS=[
  "appcache_manifest_generator.py",
  "index.html",
  "poops.html",
  "poops.js",
  "README.md",
  "readme.png",
  "document/en/ps5/index.html",
  "offsets/10.00.js",
  "offsets/10.01.js",
  "offsets/10.20.js",
  "offsets/10.40.js",
  "offsets/10.60.js",
  "offsets/11.00.js",
  "offsets/11.20.js",
  "offsets/11.40.js",
  "offsets/11.60.js",
  "offsets/12.00.js",
  "offsets/9.00.js",
  "offsets/9.20.js",
  "offsets/9.40.js",
  "offsets/9.60.js",
  "payloads/elfldr-ps5-1360.elf",
  "payloads/ftpsrv-ps5.elf",
  "payloads/gdbsrv-ps5.elf",
  "payloads/kexp_2026_05_25.bin",
  "payloads/klogsrv-ps5.elf",
  "payloads/kstuff.elf",
  "payloads/shsrv-ps5.elf",
  "payloads/websrv-ps5.elf",
  "slopkit/cat.jpg",
  "slopkit/core.js",
  "slopkit/int64.js",
  "slopkit/main.js",
  "slopkit/mem.js",
  "slopkit/mmhmm-cats-ps5.gif",
  "slopkit/poops.html",
  "slopkit/poops.js",
  "slopkit/rop.js",
  "slopkit/rop_slave.js",
  "slopkit/syscalls.js",
  "ui/payload-ftp-default.png",
  "ui/payload-ftp-failed.png",
  "ui/payload-ftp-sending.png",
  "ui/payload-ftp-sent.png",
  "ui/payload-gdb-default.png",
  "ui/payload-gdb-failed.png",
  "ui/payload-gdb-sending.png",
  "ui/payload-gdb-sent.png",
  "ui/payload-klog-default.png",
  "ui/payload-klog-failed.png",
  "ui/payload-klog-sending.png",
  "ui/payload-klog-sent.png",
  "ui/payload-kstuff-default.png",
  "ui/payload-kstuff-failed.png",
  "ui/payload-kstuff-sending.png",
  "ui/payload-kstuff-sent.png",
  "ui/payload-menu-title.png",
  "ui/payload-shell-default.png",
  "ui/payload-shell-failed.png",
  "ui/payload-shell-sending.png",
  "ui/payload-shell-sent.png",
  "ui/payload-web-default.png",
  "ui/payload-web-failed.png",
  "ui/payload-web-sending.png",
  "ui/payload-web-sent.png"
];
var MIRROR_PREFIXES=['slopkit/','offsets/','payloads/','ui/'];

function isMirrored(path){
  for(var i=0;i<MIRROR_PREFIXES.length;i++){
    if(path.indexOf(MIRROR_PREFIXES[i])===0){return true;}
  }
  return false;
}

function localUrl(path){
  return new URL(path,self.registration.scope).href;
}

function relativeLocalPath(url){
  if(url.href.indexOf(self.registration.scope)!==0){return '';}
  return decodeURIComponent(url.href.slice(self.registration.scope.length).split('?')[0]);
}

function fetchRemote(path){
  return fetch(REMOTE_BASE+path,{mode:'cors',cache:'no-store'}).then(function(response){
    if(!response||!response.ok){throw new Error('Offline asset failed: '+path);}
    return response;
  });
}

function storeRemote(cache,path){
  return fetchRemote(path).then(function(response){
    var writes=[cache.put(REMOTE_BASE+path,response.clone())];
    if(isMirrored(path)){
      writes.push(cache.put(localUrl(path),response.clone()));
    }
    return Promise.all(writes);
  });
}

function cacheRemoteAssets(cache){
  var cursor=0;
  function next(){
    if(cursor>=REMOTE_ASSETS.length){return Promise.resolve();}
    var path=REMOTE_ASSETS[cursor++];
    return storeRemote(cache,path).then(next);
  }
  return Promise.all([next(),next(),next(),next()]);
}

function fetchAndStoreLocal(cache,path){
  return fetchRemote(path).then(function(response){
    cache.put(localUrl(path),response.clone());
    return response;
  });
}

self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL).then(function(){
        return cacheRemoteAssets(cache);
      });
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(key){
        if(key!==CACHE_NAME){return caches.delete(key);}
      }));
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch',function(event){
  if(event.request.method!=='GET'){return;}
  var requestUrl=new URL(event.request.url);
  if(requestUrl.origin!==self.location.origin){return;}
  var path=relativeLocalPath(requestUrl);

  event.respondWith(
    caches.match(event.request,{ignoreSearch:true}).then(function(cached){
      if(cached){return cached;}
      if(isMirrored(path)){
        return caches.open(CACHE_NAME).then(function(cache){
          return fetchAndStoreLocal(cache,path);
        });
      }
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
    })
  );
});

