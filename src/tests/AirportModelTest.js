const db = require('../../config/dbConfig');
const Airport = require('../models/airportModel');

// Function to test the getAll method
function testGetAllAirports() {
    Airport.getAll((err, results) => {
        if (err) {
            console.error('Error fetching airports:', err);
            process.exit(1);
        } else {
            console.log('Airports fetched successfully:');
            console.log(JSON.stringify(results));
            process.exit(0);
        }
    });
}

// Call the test function
testGetAllAirports();