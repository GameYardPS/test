var CACHE_NAME='gameyard-offline-v1';
var APP_SHELL=['./','./index.html','./offline.appcache'];

self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_SHELL);
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

  if(event.request.mode==='navigate'){
    event.respondWith(
      caches.match('./index.html',{ignoreSearch:true}).then(function(cached){
        return cached||fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request,{ignoreSearch:true}).then(function(cached){
      if(cached){return cached;}
      return fetch(event.request).then(function(response){
        if(response&&response.ok){
          var copy=response.clone();
          caches.open(CACHE_NAME).then(function(cache){cache.put(event.request,copy);});
        }
        return response;
      });
    })
  );
});
