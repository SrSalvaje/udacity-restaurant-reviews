
/* Shout out to Jake Archibald, Alexandro Perez and Mathew Cranford for their tutorials on service workers
*https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
*https://alexandroperez.github.io/mws-walkthrough/?1.25.fixing-offline-mode
*https://matthewcranford.com/restaurant-reviews-app-walkthrough-part-4-service-workers/  
*/
const appName="Udacity-Restaurant-Reviews",
    staticCacheName=`${appName}-v2`,
    imgCache = `${appName}-images`;
let allCaches=[
        staticCacheName,
        imgCache
    ],
    filesToCache=[
        "/",
        "/index.html",
        "/restaurant.html",
        "/css/styles.css",
        "/css/responsive.css",
        "/js/dbhelper.js",
        "/js/main.js",
        "/js/restaurant_info.js",
        "/data/restaurants.json"
    ];

function cachedImg(request) {
    let imgUrl = request.url;
    return caches.open(imgCache).then(function(cache) {
        return cache.match(imgUrl).then(function(response){
            return response || fetch(request).then(function(networkResponse){
                cache.put(imgUrl, networkResponse.clone());
                return networkResponse;
            });
        });
    });
}

//cache assets on installation
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache){
            return cache.addAll(filesToCache);
        })
    ); 
});

//delete previous caches (based on version)//
self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    if(cacheName.startsWith(appName) && !allCaches.includes(cacheName)){
                        return cacheName;
                    }
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })   
            );
        })
    );
}); 

//intercept fetch requests
self.addEventListener("fetch", function(event) {
    const urlRequests = new URL(event.request.url);
    if(urlRequests.origin === location.origin) {
        if (urlRequests.pathname.startsWith("/restaurant.html")) {
            event.respondWith(caches.match("/restaurant.html"));
            return;
        }

        if(urlRequests.pathname.startsWith("/img")) {
            event.respondWith(cachedImg(event.request));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if(response) {
                console.log(`found ${event.request}`);
                return response;
            } else{
                console.log(`Couldn´t find cached ${event.request}`);
                return fetch(event.request);
            }   
        })
    ); 
});