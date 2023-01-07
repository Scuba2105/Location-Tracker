// initialise variable to store capital cities data.
let capitalCities; 

// Get root directory of web app.
const directory = window.location.href;

// Import the json data which is stored on the server.
async function getJSON() {
    const data = await fetch(`${directory}capitals`);
    const parsedData = await data.json();
    capitalCities = parsedData;
    console.log(capitalCities);
}

// Get the JSON data for capital cities.
async function populateContinentData() {
    await getJSON();
    const continentsArray = capitalCities.reduce((acc, curr) => {
        const currentContinent = curr.ContinentName;
        if (!acc.includes(currentContinent)) {
            acc.push(currentContinent);
            return acc;
        }
        return acc;
    },[]);

    continentsDropdown.innerHTML = continentsArray.map(continent => {
        return`<option value="${continent.toLowerCase()}">${continent}</option>`
    }).join('');
};

populateContinentData();

// Define the elements on the page.
const travelButtons = document.querySelectorAll('.travel-button');
const travelForm = document.querySelector('.travel-form');
const continentsDropdown = document.querySelector('.continent-dropdown');
const citiesDropdown = document.querySelector('.city-dropdown');

// Add event listeners to each travel button.
travelButtons.forEach(travelButton => {
    travelButton.addEventListener('click', showTravelForm);
})

// Define the event listener functions
function showTravelForm() {
    console.log(this.classList);
}