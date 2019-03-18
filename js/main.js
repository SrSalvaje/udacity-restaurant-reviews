let restaurants,
    neighborhoods,
    cuisines;
var newMap;
var markers = [];
//service worker

if ("serviceWorker" in navigator){
    navigator.serviceWorker
        .register("../sw.js").then(function(reg) {
            console.log("sw registered");
        }).catch((err) => {
            console.error(`Couldnt register sw...
            ${err}`);
        });
}

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", (event) => {
    initMap(); // added 
    fetchNeighborhoods();
    fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById("neighborhoods-select");
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement("option");
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById("cuisines-select");

    cuisines.forEach(cuisine => {
        const option = document.createElement("option");
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
};

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {

    if(navigator.onLine) { //checks if browser is online, otherwise it exits function
        try{
            self.newMap = L.map("map", {
                center: [40.722216, -73.987501],
                zoom: 12,
                scrollWheelZoom: false
            });
            L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}", {
                mapboxToken: "pk.eyJ1Ijoiam9ubWlyZW4iLCJhIjoiY2pyMGt0b3FmMG1hNTN4cGNzbDV4YzQ0NSJ9.BxlmxnUMp-cylQQ5KQbl-Q",
                maxZoom: 18,
                attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, " +
              "<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, " +
              "Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                id: "mapbox.streets"
            }).addTo(newMap);
        } catch(error){
            console.log(`Ups, couldnt load map ${error}`);
            
        }
    }else{
        document.querySelector("#map-container").style.display="none";
    }
    updateRestaurants();  
};


/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
    const cSelect = document.getElementById("cuisines-select");
    const nSelect = document.getElementById("neighborhoods-select");
    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;
    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById("restaurants-list");
    ul.innerHTML = "";

    // Remove all map markers
    if (self.markers) {
        self.markers.forEach(marker => marker.remove());
    }
    self.markers = [];
    self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById("restaurants-list");
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
    const li = document.createElement("li");

    const image = document.createElement("img");
    image.className = "restaurant-img";
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.alt=`Picture of ${restaurant.name}`;
    li.append(image);

    const name = document.createElement("h2");
    name.innerHTML = restaurant.name;
    li.append(name);

    const neighborhood = document.createElement("p");
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement("p");
    address.innerHTML = restaurant.address;
    li.append(address);

    const more = document.createElement("a");
    more.innerHTML = "View Details";
    more.href = DBHelper.urlForRestaurant(restaurant);
    more.tabIndex="0";
    li.append(more);

    return li;
};

/**
 * Add markers for current restaurants to the map.
 */

addMarkersToMap = (restaurants = self.restaurants) => {
    if(!newMap || !L){ //if undefined, then exit function
        return;
    }
    restaurants.forEach(restaurant => {
    // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
        marker.on("click", onClick);
        function onClick() {
            window.location.href = marker.options.url;
        }
        self.markers.push(marker);
    });

}; 
