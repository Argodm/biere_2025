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
    displayForecast(data, info);
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
   

inputElement.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const input = getInputValue(); 
        getCityWeather(input);
    }
});

async function fetchByCoordinates(lon, lat){
    const url = baseUrl + 'lon=' + lon + '&lat='+ lat + '&ac=0&lang=en&unit=metric&output=json&tzshift=0'
    console.log(url);
    const httpRes = await fetch(url);
    const data = await httpRes.json();
    return data;
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


async function displayForecast(weather_data, city_data) {
    let index = getCurrentTimepoint(weather_data) + 8;
    let max = weather_data.dataseries.length;
    let day_index = 1;
    
    //city
    const cardTitle = document.getElementById("location-name");
    cardTitle.textContent = `${city_data[2]}`;

    console.log(max);


    for (let i=index; i<max; i += 8) {
        
        //7 next days
        const data_i = weather_data.dataseries[i];
        const tempname_i =  document.getElementById("name" + day_index.toString());
        tempname_i.textContent = getFutureDate(day_index);
        const tempspan_i = document.getElementById("temp" + day_index.toString());
        tempspan_i.textContent = data_i.temp2m + "°C";

        const icon_i = document.getElementById("icon" + day_index.toString());
        icon_i.src = "./image/" + data_i.weather + '.png';
        day_index += 1;
    }
}

function getFutureDate(days) {
    let date = new Date(); // Get today's date
    date.setDate(date.getDate() + days); // Add the desired number of days

    let options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
}


async function main() {
    const info = await getCoordinates('nancy');
    const data = await fetchByCoordinates(info[0], info[1]);
    console.log(data);
    displayForecast(data, info);
    console.log(getCurrentTimepoint(data));
}

main();