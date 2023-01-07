let capitalCities; 

const directory = window.location.href;

async function getJSON() {
    const data = await fetch(`${directory}capitals`);
    const parsedData = await data.json();
    capitalCities = parsedData;
    console.log(capitalCities);
}

getJSON();
