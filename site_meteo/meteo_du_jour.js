const baseUrl = 'http://www.7timer.info/bin/civil.php?'
const inputElement = document.querySelector(".recherche");


function getInputValue() {
    const userInput = inputElement.value;
    console.log("User input:", userInput);
    return userInput.toLowerCase();
}

async function getCityWeather(userInput) {
    const info = await getCoordinates(userInput);
    const data = await fetchByCoordinates(info[0], info[1]);
    console.log(data);
    displayWeather(data, info);
}


inputElement.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const input = getInputValue(); 
        getCityWeather(input);
    }
});

const windCorrespondance = {
    1: 	"Below 0.3m/s (calm)",
    2 :	"0.3 -3.4m/s (light)",
    3: 	"3.4-8.0m/s (moderate)",
    4:	"8.0-10.8m/s (fresh)",
    5:	"10.8-17.2m/s (strong)",
    6: 	"17.2-24.5m/s (gale)",
    7:	"24.5-32.6m/s (storm)",
    8: "Over 32.6m/s (hurricane)"
};

const precipCorrespondance = {
    0: 	"None",
    1: 	"0-0.25mm/hr",
    2: 	"0.25-1mm/hr",
    3: 	"1-4mm/hr",
    4:	"4-10mm/hr",
    5: 	"10-16mm/hr",
    6: 	"16-30mm/hr",
    7: 	"30-50mm/hr",
    8: 	"50-75mm/hr",
    9: 	"Over 75mm/hr"
};


async function fetchByCoordinates(lon, lat){
    const url = baseUrl + 'lon=' + lon + '&lat='+ lat + '&ac=0&lang=en&unit=metric&output=json&tzshift=0'
    console.log(url);
    const httpRes = await fetch(url);
    const data = await httpRes.json();
    return data;
}

function getCurrentTimepoint(weather_data) {
    const init = weather_data.init.slice(-2); //get init time as a string
    const initTime = parseInt(init, 10) + 3; //get the time for the first timepoint
    const current_hour = (new Date()).getHours();
    let index = 0;
    let nearest_hour = initTime;
    
    while  (nearest_hour < current_hour) {
        nearest_hour += 3
        index += 1
    }
    return index
}

async function displayWeather(weather_data, city_data) {

    //city
    const cardTitle = document.getElementById("location-name");
    //cardTitle.classList.add("card-title", "text-center");
    cardTitle.textContent = `${city_data[2]}`;

    //current weather
    let index = getCurrentTimepoint(weather_data);
    console.log(index);
    //weather icon
    const cardIcon = document.getElementById("current-icon");
    console.log('/image/' + weather_data.dataseries[index].weather + '.png');
    cardIcon.src = "./image/" + weather_data.dataseries[index].weather + '.png';
    
    //Weather info 
    const windSpan = document.getElementById("current_wind_speed");
    const precipSpan = document.getElementById("current_precip");
    const tempSpan = document.getElementById("current_temperature");

    windSpan.textContent = "Wind : " + windCorrespondance[weather_data.dataseries[index].wind10m.speed];
    precipSpan.textContent = "Precip. : " + precipCorrespondance[weather_data.dataseries[index].prec_amount];
    tempSpan.textContent = "Temp. : " + weather_data.dataseries[index].temp2m + "°C"

    //weather forecast
    for (let i=1; i<5; i++) {
        const data_i = weather_data.dataseries[index + i];
        const tempspan_i = document.getElementById("temp" + i.toString());
        tempspan_i.textContent = data_i.temp2m + "°C";

        const icon_i = document.getElementById("icon" + i.toString());
        icon_i.src = "./image/" + data_i.weather + '.png';
    }

}


async function getCoordinates(city) {
    const url = 'https://nominatim.openstreetmap.org/search?city=' + city + '&format=json';
    console.log(url);
    const httpRes = await fetch(url);
    const data = await httpRes.json();
    const lon = data[0].lon;
    const lat = data[0].lat;
    const name = data[0].display_name;
    console.log(lon, lat, name);
    return [lon, lat, name];
}


async function main() {
    const info = await getCoordinates('nancy');
    const data = await fetchByCoordinates(info[0], info[1]);
    console.log(data);
    displayWeather(data, info);
}

main();

