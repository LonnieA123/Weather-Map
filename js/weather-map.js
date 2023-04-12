"use strict"

let weatherDiv = $("#weather")
let locationDiv = $("#city")
let search = $("#searchLocation")

// mapbox
mapboxgl.accessToken = keys.mapbox;

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lonnie123/cld4tkj5i001r01nwiaprf6hb',
    zoom: 15,
    center: [-98.4916, 29.4252]

});


// map controls
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    })
);

map.addControl(new mapboxgl.NavigationControl());



// creates marker
let markers = new mapboxgl.Marker()


// FUNCTIONS //


// append function
function pushData(data) {
    weatherDiv.html("")
    locationDiv.html("")

    let location = `<h1 class="">${data.city.name}</h1>`
    locationDiv.append(location)

    for (let i = 0; i < data.list.length; i += 8) {
        console.log(data.list[i]);

// creates html to be appended
        let html = `<div class="card text-white bg-dark mt-4 me-2 ms-2 mb-4 " style="width: 18rem;">
                <ul class="list-group list-group-flush ">
                    <li class="list-group-item text-white bg-dark">${data.list[i].dt_txt.slice(0,10)} </li>
                    <li class="list-group-item text-white bg-dark">low : ${data.list[i].main.temp_min} <br> hi : ${data.list[i].main.temp_max} </li>
                    <li class="list-group-item flex-fill text-white bg-dark "> ${data.list[i].weather[0].description} <br> Humidity: ${data.list[i].main.humidity} <br> Wind: ${data.list[i].wind.speed} <br> Pressure: ${data.list[i].main.pressure} <br> <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png"></li>
                </ul>
         </div>`
        weatherDiv.append(html)
    }
}


// drag function
function drag() {
    const lngLat = markers.getLngLat();
    console.log(lngLat)

    geocoder([lngLat.lng, lngLat.lat])

    map.flyTo({
        center: [lngLat.lng, lngLat.lat],
        essential: true
    });
}


//geocode and fly and marker function
function geocoder(result) {
    console.log(result)
    $.get('https://api.openweathermap.org/data/2.5/forecast', {
        lat: result[1],
        lon: result[0],
        appid: keys.weathermap,
        units: 'imperial'
    }).done((pushData)).fail(function (jqXhr, status, error) {
        console.log(jqXhr);
        console.log(status);
        console.log(error);
    });
//fly animation
    map.flyTo({
        center: [result[0], result[1]],
        essential: true,
        zoom: 10
    });
//creates marker and allows it to be draggable

    markers.setLngLat([result[0], result[1]]).addTo(map)
    markers.setDraggable(true);


}


// main function
function main(event) {
    event.preventDefault()
//resets weather section
//     $("#weather").html("")
// geocodes typed in location
    geocode(search.val(), keys.mapbox).then((geocoder))
}


geocode("san antonio texas", keys.mapbox).then((geocoder))


// search event listener
$("#searchButton").on("click",main)


//event listener for drag
markers.on('dragend', drag)



map.on('click', (e) => {
    geocoder([e.lngLat.lng, e.lngLat.lat])

    markers.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map)
    markers.setDraggable(true);

});












