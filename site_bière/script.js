const baseUrl = 'http://www.7timer.info/bin/civil.php?'


async function fetchByCoordinates(lon, lat){
    const url = baseUrl + 'lon=' + lon + '&lat='+ lat + '&ac=0&lang=en&unit=metric&output=json&tzshift=0'
    console.log(url);
    const httpRes = await fetch(url);
    const data = await httpRes.json();
    return data;
}

async function displayWeather(weather_data, city_data) {
    const weatherCard = document.getElementById("weather-card");

    //city
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title", "text-center");
    console.log(city_data[2])
    cardTitle.textContent = `${city_data[2]}`;
    weatherCard.appendChild(cardTitle);

    //weather icon
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardIcon = document.createElement("img");
    cardIcon.src = '../image/' + weather_data.dataseries[0].weather + '.png';
    cardIcon.classList.add("img-fluid", "me-3");
    cardBody.appendChild(cardIcon);

    weatherCard.appendChild(cardBody);
}

async function getCoordinates(city) {
    const url = 'https://nominatim.openstreetmap.org/search?city=' + city + '&format=json';
    const httpRes = await fetch(url);
    const data = await httpRes.json();
    const lon = data[0].lon;
    const lat = data[0].lat;
    const name = data[0].display_name;
    return [lon, lat, name];
}

async function main() {
    const info = await getCoordinates('nancy');
    const data = await fetchByCoordinates(info[0], info[1]);
    console.log(data);
    displayWeather(data, info);
}

main();

