// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

//Setup port for the server
const port = 3000;

// Spin up the server
const server = app.listen(port,
    () => console.log(`Server started and listening to the port: ${port}`));

// Initialize all route with a callback function
app.get('/all', sendProjectData);

// Callback function to complete GET '/all'
/**
 * @description Sends all routes end point 'projectData' to client
 * @param {Object} request - contains the data passed from client
 * @param {Object} response - response to be sent back to client
 */
function sendProjectData(request, response) {
    response.send(projectData);
}

// Post Route
app.post('/addWeatherData', addWeatherData);

/**
 * @description Adds data fetched from OpenWeatherMap and user entered data to the all routes end point 'projectData'
 * @param {Object} request - contains the data passed from client
 * @param {Object} response - response to be sent back to client
 */
function addWeatherData(request, response) {

    projectData = {
        temperature: request.body.temperature,
        date: request.body.date,
        userData: request.body.userData
    };

    response.send(projectData);
}