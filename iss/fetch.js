let url = 'https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')
let timeIssLocationFetched = document.querySelector('#time')

let update = 10000
let maxFailedAttempts = 3

let issMarker
let icon = L.icon({
    iconUrl: 'iss_icon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})

let map = L.map('iss-map').setView([0, 0], 1) 
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
id: 'mapbox.streets',
accessToken: 'pk.eyJ1IjoiY2xhcmFsIiwiYSI6ImNrZXZ6dWFlNzJraGIycWxnNzZvdWlzNWkifQ.Tpt7TRmjwrNHCPbwvFhPkg'
}).addTo(map)

iss(maxFailedAttempts)  // call function one time to start
// setInterval(iss, update)  // 10 seconds

function iss(attempts) {

    if (attempts <= 0 ) {
        alert('Failed to contact ISS server after several attempts.')
        return
    }

    fetch(url).then( res => res.json() )
    .then( (issData) => {
        console.log(issData)  // TODO - display data on web page
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat 
        issLong.innerHTML = long

        // create marker if it doesn't exist
        // move marker if it does exist

        if (!issMarker) {
            // create marker 
            issMarker = L.marker([lat, long], {icon: icon} ).addTo(map)
        } else {
            issMarker.setLatLng([lat, long])
        }

        let now = Date()
        timeIssLocationFetched.innerHTML = `This data was fetched at ${now}`

    }).catch( (err) => {
        attempts = attempts - 1 // subtract 1 from number of attempts 
        console.log('ERROR!', err) 
    }).finally( () => {
        setTimeout(iss, update, attempts)
    })
}

