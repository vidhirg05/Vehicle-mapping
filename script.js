let map;
let marker;
let polyline;
let coordinates = [];
let index = 0;
let intervalId;
let isPlaying = false;

async function initMap() {
  const response = await fetch('dummy-route.json');
  const data = await response.json();
  coordinates = data.map(loc => [loc.latitude, loc.longitude]);

  // Initialize map
  map = L.map('map').setView(coordinates[0], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  marker = L.marker(coordinates[0]).addTo(map);
  polyline = L.polyline([coordinates[0]], { color: 'blue' }).addTo(map);
}

function startSimulation() {
  if (isPlaying || index >= coordinates.length - 1) return;
  isPlaying = true;

  intervalId = setInterval(() => {
    index++;
    if (index >= coordinates.length) {
      clearInterval(intervalId);
      return;
    }
    marker.setLatLng(coordinates[index]);
    polyline.addLatLng(coordinates[index]);
    updateInfo(coordinates[index]);
    map.panTo(coordinates[index]);
  }, 1000);
}

function pauseSimulation() {
  isPlaying = false;
  clearInterval(intervalId);
}

function updateInfo(coord) {
  document.getElementById('info').innerText = `Lat: ${coord[0]}, Lng: ${coord[1]}`;
}

document.getElementById('play').addEventListener('click', startSimulation);
document.getElementById('pause').addEventListener('click', pauseSimulation);

initMap();
