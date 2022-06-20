// Affichage de la carte
var map = L.map('map', {
    // center: [43.297493, 5.373192],
    center: [43.29358673095703, 5.38786506652832],
    zoom: 12
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);