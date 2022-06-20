// Affichage de la carte
var map = L.map('map', {
    // center: [43.297493, 5.373192],
    center: [43.29358673095703, 5.38786506652832],
    zoom: 12
});

function getBreweries(url, callback) {
    request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "json";
    $(request).on("load", function () {
        if (request.status >= 200 && request.status < 400) {
            // Appelle de "callback" en lui passant la réponse de la requête
            callback(request.response);
            // return request.response
        } else {
            console.error(request.status + " " + request.statusText + " " + url);
        }
    });
    $(request).on("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    request.send(null);
}

function insertDataBrewery(brewery) {
    $('#info-breweries>tbody').append('<tr></tr>');
    $('#info-breweries>tbody>tr:last').append('<td>' + brewery.name + '</td>'); // Name
    $('#info-breweries>tbody>tr:last').append('<td>' + brewery.street + ', ' + brewery.city + '</td>'); // Address
    $('#info-breweries>tbody>tr:last').append('<td>' + brewery.phone + '</td>'); // Phone
    $('#info-breweries>tbody>tr:last').append('<td><a href="' + brewery.website_url + '">' + brewery.website_url + '</a></td>'); // Website
}

getBreweries("https://api.openbrewerydb.org/breweries?by_country=France", function (response) {
    response.forEach(element => {
        if (element.latitude !== null && element.longitude !== null) {
            insertDataBrewery(element);

            // Défini l'icone du marqueur
            let myIcon = L.divIcon({ className: 'fa-solid fa-location-dot marker' });
            // Place les marqueurs sur la carte
            L.marker([element.latitude, element.longitude], { icon: myIcon }).addTo(map);
        }
    });
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);