// Define the elements on the page.
const travelButtons = document.querySelectorAll('.travel-button');
const travelForm = document.querySelector('.travel-form');
const continentsDropdown = document.querySelector('.continent-dropdown');
const countriesDropdown = document.querySelector('.country-dropdown');
const cityLabel = document.querySelector('.city-label');
const cancel = document.querySelector('.cancel');
const submit = document.querySelector('.submit');
const subject = document.querySelector('.subject');
const currentLocations = document.querySelectorAll('.current-location');
const currentContinents = document.querySelectorAll('.continent-location');
const currentCountries = document.querySelectorAll('.country-location')
const counts = document.querySelectorAll('.count');
const mapContainer = document.querySelector('.world-map');
let svgLoaded = false;
let svgElements = [];

// Set the web socket
const rootPath = window.location.href;
const httpPrefix = rootPath.split('//')[0];
const wsPrefix = httpPrefix == 'https' ? 'wss' : 'ws'; 
const travelSocketUrl = `${wsPrefix}://${rootPath.split('//')[1]}`;
console.log(travelSocketUrl);
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
    const currentContinent = returnedObject["New Continent"];
    const currentCountry = returnedObject["New Country"];
    const previousCountry = returnedObject["Previous Country"];
    const newCount = returnedObject["Travel Count"];
    
    // Set the new values in the info display
    currentLocations[index].innerHTML = `<strong>Current Location:</strong> ${currentLocation}`;
    currentContinents[index].innerHTML = `<strong>Current Continent:</strong> ${currentContinent}`;
    currentCountries[index].innerHTML = `<strong>Current Country:</strong> ${currentCountry}`;
    counts[index].innerHTML = `<strong>No. of Times Travelled:</strong> ${newCount}`;

    if (svgLoaded) {
    
    // Define the SVG document
    const svgDoc = map.contentDocument;
    const svgDocElement = svgDoc.documentElement;
        
    // Lower case the country name to select the elements of the svg document.
    const currentSvgElementID = lowerCase(currentCountry);
    const previousSvgElementID = lowerCase(previousCountry);

    const currentSvgElement = svgDoc.querySelector(`.${currentSvgElementID}`);
    const previousSvgElement= newCount == 1 ? undefined : svgDoc.querySelector(`.${previousSvgElementID}`);
    const playerColor = index == 0 ? '#d33434' : index == 1 ? '#242699' : '#17837d';
    const currentInitialColor = currentSvgElement.getAttribute('style').split(': ')[1]; 
    //const previousInitialColor = currentSvgElement.getAttribute('style').split(': ')[1];

        // Clear the previous svg highlighting
        if (previousSvgElement != undefined) {
            // Get first element of array
            const animateTag = previousSvgElement.getElementsByTagName("animate")[0];
            const textTag = svgDoc.getElementById(`country${index}`);
            animateTag.remove();
            textTag.remove(); 
        }
        
        // Set the current svg highlighting 
        if (currentSvgElement != undefined) {
            /* Create the DOM object for shape animation, and set its attributes. */
            const animateElement = document.createElementNS('http://www.w3.org/2000/svg', "animate");
            animateElement.setAttribute("attributeType", "XML");
            animateElement.setAttribute("attributeName", "fill");
            animateElement.setAttribute("values", `${playerColor};${currentInitialColor}`);
            animateElement.setAttribute("dur", "2s");
            animateElement.setAttribute("repeatCount", "indefinite");
            /** Append the animation element to the shape element. */
            currentSvgElement.appendChild(animateElement);

            // Determine the approximate location for the country label
            const boundingRect = currentSvgElement.getBBox();
            const x =  boundingRect.x - 35;
            const y = boundingRect.y + 2;
            const height = boundingRect.height;
            const width = boundingRect.width;
            const centerX = x + width/2;
            const centerY = y + height/2;

            // Insert a text element
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', "text");
            textElement.setAttribute("id", `country${index}`);
            textElement.setAttribute("style", "white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 18px;");
            textElement.setAttribute("x", `${centerX}px`);
            textElement.setAttribute("y", `${centerY}px`);
            textElement.textContent = currentCountry;
            svgDocElement.appendChild(textElement); 
            console.log(svgDocElement);          
        }
        else {
             alert('The selected county\'s element could not be found in the svg');
        }
    }
    else {
        alert('The svg cannot be updated as it has not loaded');
    }
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

// Capitalise first letters of a word
function capitaliseFirstLetters(words) {
    const stringArray = words.split(' ');
    return stringArray.map(word => {
        if (word == 'and') {
            return word;
        }
        return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
};

// capitalise all Letters in the country name
function capitaliseAllLetters(word) {
    const capitalisedWord = word.split('').map((letter) => {
        return letter.toUpperCase();
    }).join('');
    return capitalisedWord;
}

// lower case first letters of a word
function lowerCase(word) {
    return word.toLowerCase();
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
    
    // Populate the continents in the dropdown values.
    const continentsArray = generateArray(capitalCities, 'ContinentName');
    continentsDropdown.innerHTML = generateDropdownValues(continentsArray);

    // Select the initial continent and generate the cities dropdown.
    const initialContinent = continentsArray[0];
    const filteredCities = filterCitiesObject('ContinentName', initialContinent);
    const countriesArray = generateArray(filteredCities, 'CountryName');
    countriesDropdown.innerHTML = generateDropdownValues(countriesArray);

    // Select the initial coountry and generate the capital city.
    const initialCountry = countriesArray[0];
    const filteredCountries = filterCitiesObject('CountryName', initialCountry)[0];
    const capitalCity = filteredCountries.CapitalName;
    cityLabel.innerHTML = capitalCity
};

populateContinentData();

// Add event listeners to each travel button.
travelButtons.forEach(travelButton => {
    travelButton.addEventListener('click', showTravelForm);
});

// Cancel button event listener
cancel.addEventListener('click', hideTravelForm);

// Submit button event listener
submit.addEventListener('click', submitTravelForm);

// Event listener for continents dropdown
continentsDropdown.addEventListener('change', updateCountries);

// Event listener for continents dropdown
countriesDropdown.addEventListener('change', updateCities);

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
    
    // Calculate the new continent location
    const newContinent = capitaliseFirstLetters(continentsDropdown.value); 

    // Calculate the new location value
    const newCountry = countriesDropdown.value == "usa" ? capitaliseAllLetters(countriesDropdown.value) : capitaliseFirstLetters(countriesDropdown.value);
    
    // Calculate the new capital city
    const capitalCity = capitaliseFirstLetters(cityLabel.textContent);

    // Calculate the previous country as the current country before change
    const previousCountryData = currentCountries[index].textContent;
    const previousCountry = previousCountryData.split(': ')[1];  

    // Calculate the count 
    const oldCountText = counts[index].textContent;
    const newCountText = oldCountText.split(': ')[1];
    const newCount = Number(newCountText) + 1;

    // Calculate the count
    const dataObject = {'index': index, 'New Location': capitalCity, 'New Continent': newContinent, 'New Country': newCountry, 'Previous Country': previousCountry,'Travel Count': newCount}; 
    socket.send(JSON.stringify(dataObject));

    // Close the form
    subject.textContent = '';
    travelForm.style.visibility = 'hidden';
}

function updateCountries() {
    cityLabel.textContent = ''
    const newValue = this.value;
    const newContinent = capitaliseFirstLetters(newValue);
    const filteredCountries = filterCitiesObject('ContinentName', newContinent);
    const countriesArray = generateArray(filteredCountries, 'CountryName');    
    countriesDropdown.innerHTML = generateDropdownValues(countriesArray);

    // Initialise the city
    const initialCountry = countriesArray[0];
    const newCountryObject = filterCitiesObject('CountryName', initialCountry)[0];
    const initialCapital = newCountryObject.CapitalName;
    cityLabel.textContent = initialCapital;
};
  
function updateCities() {
    const newValue = this.value;
    const newCountry = newValue == 'usa' ? capitaliseAllLetters(newValue) : capitaliseFirstLetters(newValue);
    const filteredCountry = filterCitiesObject('CountryName', newCountry)[0];
    const capitalCity = filteredCountry.CapitalName;   
    cityLabel.innerHTML = capitalCity;
};

// Access SVG elements
const map = document.querySelector(".map-image");

// It's important to add an load event listener to the object,
// as it will load the svg doc asynchronously.
map.addEventListener("load",function() {
    svgLoaded = true;
});

    



