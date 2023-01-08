// Set the web socket
const travelSocketUrl = 'ws://localhost:5050/'
const socket = new WebSocket(travelSocketUrl);

// Web socket listener on open connection
socket.onopen = () => {
  socket.send('Here\'s some text that the server is urgently awaiting!'); 
}

// Web socket listener on message received from server
socket.onmessage = e => {

    // Parse the returned data
    const returnedObject = JSON.parse(e.data);
    
    // Extract the data from the returned data object
    const index = returnedObject.index;
    const currentLocation = returnedObject["New Location"];
    const previousLocation = returnedObject["Old Location"];
    const newCount = returnedObject["Travel Count"];
    
    // Set the new values in the info display
    currentLocations[index].textContent = `Current Location: ${currentLocation}`;
    previousLocations[index].textContent = `Previous Location: ${previousLocation}`;
    counts[index].textContent = `No. of Times Travelled: ${newCount}`;
}

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
const subject = document.querySelector('.subject');
const currentLocations = document.querySelectorAll('.current-location');
const previousLocations = document.querySelectorAll('.previous-location');
const counts = document.querySelectorAll('.count');
const mapContainer = document.querySelector('.world-map');

// Add event listeners to each travel button.
travelButtons.forEach(travelButton => {
    travelButton.addEventListener('click', showTravelForm);
});

// Cancel button event listener
cancel.addEventListener('click', hideTravelForm);

// Submit button event listener
submit.addEventListener('click', submitTravelForm);

// Event listener for continents dropdown
continentsDropdown.addEventListener('change', updateCities);



// Define the event listener functions
function showTravelForm() {
    // Get ID of parent element of clicked button
    const classID = this.parentNode.parentNode.classList[1];
    const id = classID[0].toUpperCase() + classID.substring(1, 6) + ' ' + classID.substring(6);
    subject.textContent = id;
    travelForm.style.visibility = 'visible';
};

function hideTravelForm() {
    subject.textContent = '';
    travelForm.style.visibility = 'hidden';
};

function submitTravelForm() {

    // Determine ID from the form
    const id = subject.textContent;

    // Index (0-2) determines what players info panel is to be changed
    const index = Number(id.split(' ')[1]) - 1;
    
    // Calculate the old location based on current location before travel
    const newLocationText = currentLocations[index].textContent;
    const oldLocation = newLocationText.split(': ')[1];

    // Calculate the new location value
    const locationValue = citiesDropdown.value;
    
    // Capitalise first letters
    const stringArray = locationValue.split(' ');
    const newLocation = stringArray.map(word => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
        
    // Calculate the count 
    const oldCountText = counts[index].textContent;
    const newCountText = oldCountText.split(': ')[1];
    const newCount = Number(newCountText) + 1;

    // Calculate the count
    const dataObject = {'index': index, 'New Location': newLocation, 'Old Location': oldLocation, 'Travel Count': newCount}; 
    socket.send(JSON.stringify(dataObject));

    // Close the form
    subject.textContent = '';
    travelForm.style.visibility = 'hidden';
}

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
    const usa = svgDoc.getElementById("usa");
    const brazil = svgDoc.getElementById("brazil");
    // add behaviour
    let clicked = false;

    usa.addEventListener("click",function(){
        clicked = !clicked;
        if (clicked == true) {
            this.style.fill = 'rgb(228, 186, 128)';
            const boundingRect = this.getBoundingClientRect();
            const x =  boundingRect.x;
            const y = boundingRect.y;
            const height = boundingRect.height;
            const width = boundingRect.width;
            const dot = document.createElement('div');
            dot.classList.add('marker');
            dot.style.position = 'absolute';
            dot.style.top = `${164 + y}px`  
            dot.style.left = `${500 + x}px`
            mapContainer.append(dot);  
        }
        else {
            this.style.fill = 'red';
        }
    }, false);
}, false);



