document.addEventListener('DOMContentLoaded', (event) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter a task';
    document.body.appendChild(input);

    const ul = document.createElement('ul');
    document.body.appendChild(ul);

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const task = input.value.trim();
            if (task) {
                const li = document.createElement('li');
                li.textContent = task;
                ul.appendChild(li);
                input.value = '';
            }
        }
    });
    ul.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            ul.removeChild(e.target);
        }
    });
});

async function fetchBeerByUrl(url){
    const httpRes = await fetch(url);
    const data = await httpRes.json();
    return data;
}

async function displayBeer(beer) {
    const cardContainer = document.getElementById("card-container");
    const beerCard = document.createElement("div");
    beerCard.classList.add("card", "h-100", "shadow-sm");

    cardContainer.appendChild(beerCard);
    
}

console.log(fetchBeerByUrl('https://api.punkapi.com/v2/beers/1'));