/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
//+1 added to getMonth() to get correct month
let newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

//Authorization to append API Key to the URL
const AUTH = '&appid=<api-key>';

//Part of data used to convert the temperature from Kelvin to F
const KELVIN_CONV_VALUE = 459.67;

//Data to display when OpenWeatherMao returns error
const ERROR_TEMP_FETCH = 'Error in fetching data.';

// Event listener to add function to existing HTML DOM Button element
document.getElementById('generate').addEventListener('click', generateWeather);

/* Function called by event listener */
/**
 * @description Call back function called on click of Generate button
 * @param {Event object} event - browser events - click in this case
 */
function generateWeather(event) {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    //Bail out early if zip code is not entered
    if(!zip) {
        alert('Enter a zip code to continue');
        return;
    }

    //Call GET Web API
    getData(`${BASE_WEATHER_URL}${zip}${AUTH}`)
    .then((data) => {
        if(data.cod == 200) { //for success response
            postData('/addWeatherData', {temperature: getTempInF(data.main.temp), date: newDate, userData: feelings});
        } else { //for error scenarios
            postData('/addWeatherData', {temperature: ERROR_TEMP_FETCH, date: newDate, userData: feelings});
        }
        updateUI();
    });
}

/* Function to GET Web API Data*/
/**
 * @description Makes a GET call to the URL specified and returns the response
 * @param {String} url - URL to make a GET call to
 */
const getData = async (url = '') => {
    const request = await fetch(url);
    try{
        const response = await request.json();
        return response;
    } catch(error) {
        console.error('Error in fetching data: ', error);
    }
};

/* Function to POST data */
/**
 * @description Makes a POST call to the URL specified along with properties and data
 * @param {String} url - URL to make a POST call to
 * @param {Object} data - data to be posted to server
 */
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.error('Error in posting data: ', error);
    }
};

/* Function to GET Project Data */
/**
 * @description Makes a GET call to get all end point object data and update the same in the UI
 */
const updateUI = async () => {
    const request = await fetch('/all');

    try {
        const projectData = await request.json();
        document.getElementById('temp').innerHTML = projectData.temperature;
        document.getElementById('date').innerHTML = projectData.date;
        document.getElementById('content').innerHTML = projectData.userData;
    } catch (error) {
        console.log('Error in updating UI: ', error);
    }
};

/**
 * @description Converts temperature in Kelvin to F
 * @param {String} temp - value in Kelvin that needs to be converted to F and returned to the calling method
 */
function getTempInF(temp) {
    return Math.round(temp * (9/5) - KELVIN_CONV_VALUE);
}
