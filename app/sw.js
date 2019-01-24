const appName="Udacity-Restaurant-Reviews",
    staticCacheName=`${appName}-v1.0`,
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

//cache assets on installation
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache){
            return cache.addAll(filesToCache);
        })
    ); 
});

//delete previous caches (based on version)//
/* self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName.startsWith(appName) && !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })   
            );
        })
    );
}); */ 