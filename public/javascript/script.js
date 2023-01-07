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
};

// Filter the cities array of objects 
function filterCitiesObject(property, value) {
    return capitalCities.filter(city => {
        return city[property] == value;
    })
};

// Generate dropdown options
function generateDropdownValues(array) {
    return array.map(item => {
        return`<option value="${item.toLowerCase()}">${item}</option>`
    }).join('');
};

// Generate an array for the selected property from the cities array of objects 
function generateArray(citiesObjectArray, property) {
    const invalidData = ['US', 'UM', 'N/A']
    return citiesObjectArray.reduce((acc, curr) => {
        if (!acc.includes(curr[property]) && !invalidData.includes(curr[property])) {
            acc.push(curr[property]);
            return acc;
        }
        return acc;
    },[]).sort();
};

// Get the JSON data for capital cities.
async function populateContinentData() {
    await getJSON();
    const continentsArray = generateArray(capitalCities, 'ContinentName');

    continentsDropdown.innerHTML = generateDropdownValues(continentsArray);

    // Select the initial continent and generate the cities dropdown.
    const initialContinent = continentsArray[0];
    console.log(initialContinent);
    const filteredCities = filterCitiesObject('ContinentName', initialContinent);
    const citiesArray = generateArray(filteredCities, 'CapitalName');
    
    citiesDropdown.innerHTML = generateDropdownValues(citiesArray);
};

populateContinentData();

// Define the elements on the page.
const travelButtons = document.querySelectorAll('.travel-button');
const travelForm = document.querySelector('.travel-form');
const continentsDropdown = document.querySelector('.continent-dropdown');
const citiesDropdown = document.querySelector('.city-dropdown');
const cancel = document.querySelector('.cancel');
const submit = document.querySelector('.submit');

// Add event listeners to each travel button.
travelButtons.forEach(travelButton => {
    travelButton.addEventListener('click', showTravelForm);
});

// Event listener for continents dropdown
continentsDropdown.addEventListener('change', updateCities);

// Cancel button event listener
cancel.addEventListener('click', hideTravelForm);


// Define the event listener functions
function showTravelForm() {
    travelForm.style.visibility = 'visible';
};

function hideTravelForm() {
    travelForm.style.visibility = 'hidden';
};

function updateCities() {
    const newValue = this.value;
    const newContinentWords = newValue.split(' ');
    const newContinent = newContinentWords.map(word => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
    const filteredCities = filterCitiesObject('ContinentName', newContinent);
    const citiesArray = generateArray(filteredCities, 'CapitalName');    
    citiesDropdown.innerHTML = generateDropdownValues(citiesArray);
};
      

// Access SVG elements
const map = document.querySelector(".map-image");

// It's important to add an load event listener to the object,
// as it will load the svg doc asynchronously
map.addEventListener("load",function(){

    // get the inner DOM of alpha.svg
    const svgDoc = map.contentDocument;
    // get the inner element by id
    var usa = svgDoc.getElementById("usa");
    // add behaviour
    let clicked = false;

    usa.addEventListener("click",function(){
        clicked = !clicked;
        if (clicked == true) {
            this.style.fill = 'rgb(228, 186, 128)';
        }
        else {
            this.style.fill = 'red';
        }
    }, false);
}, false);



