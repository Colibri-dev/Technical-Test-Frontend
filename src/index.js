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
    // Formatage du numéro de téléphone
    let phone = '0' + brewery.phone;
    phone = phone.replace(/(.{2})(?!$)/g, "$1 ");

    $('#info-breweries>tbody').append('<tr></tr>');
    $('#info-breweries>tbody>tr:last').append('<td>' + brewery.name + '</td>'); // Name
    $('#info-breweries>tbody>tr:last').append('<td>' + brewery.street + ', ' + brewery.city + '</td>'); // Address
    $('#info-breweries>tbody>tr:last').append('<td>' + phone + '</td>'); // Phone
    $('#info-breweries>tbody>tr:last').append('<td><a href="' + brewery.website_url + '">' + brewery.website_url + '</a></td>'); // Website
}

var totalBreweries = 0;
var breweryCityNumber = [];
var breweryCityName = [];
var breweryStateNumber = [];
var breweryStateName = [];

getBreweries("https://api.openbrewerydb.org/breweries?by_country=France", function (response) {
    response.forEach(element => {
        if (element.latitude !== null && element.longitude !== null) {
            // Calcul du total
            totalBreweries = totalBreweries + 1;
            if (breweryCityName.indexOf(element.city) === -1) {
                breweryCityName.push(element.city);
                breweryCityNumber.push(1);
            } else {
                breweryCityNumber[breweryCityName.indexOf(element.city)] = breweryCityNumber[breweryCityName.indexOf(element.city)] + 1;
            }

            if (breweryStateName.indexOf(element.state) === -1) {
                breweryStateName.push(element.state);
                breweryStateNumber.push(1);
            } else {
                breweryStateNumber[breweryStateName.indexOf(element.state)] = breweryStateNumber[breweryStateName.indexOf(element.state)] + 1;
            }

            // Insertion des données des Breweries
            insertDataBrewery(element);

            // Défini l'icone du marqueur
            let myIcon = L.divIcon({ className: 'fa-solid fa-location-dot marker' });
            // Place les marqueurs sur la carte
            L.marker([element.latitude, element.longitude], { icon: myIcon }).addTo(map);
        }
    });

    // Ajout des nombres de Breweries
    $('#total-breweries>p').append('<span>' + totalBreweries + '</span><br/>Brewerie(s)');
    $('#number-breweries-city>p').append('<span>' + Math.max.apply(this, breweryCityNumber) + '</span><br/>In ' + breweryCityName[$.inArray(Math.max.apply(this, breweryCityNumber), breweryCityNumber)]);
    $('#number-breweries-state>p').append('<span>' + Math.max.apply(this, breweryStateNumber) + '</span><br/>' + breweryStateName[$.inArray(Math.max.apply(this, breweryStateNumber), breweryStateNumber)]);
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);