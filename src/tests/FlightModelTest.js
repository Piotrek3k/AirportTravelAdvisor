const db = require('../../config/dbConfig');
const Flight = require('../models/flightModel');
const reconstructPath = require('../models/flightModel')

// Function to test the getAll method
function testGetAllFlights() {
    Flight.getAll((err, results) => {
        if (err) {
            console.error('Error fetching flights:', err);
            process.exit(1);
        } else {
            console.log('Flights fetched successfully:');
            console.log(JSON.stringify(results));
            process.exit(0);
        }
    });
}

function testGraphFlights() {
    // Flight.graph(1,0,0,(err, results) => {
    //     console.log("here2")
    //     if (err) {
    //         console.error('Error fetching flights:', err);
    //         process.exit(1);
    //     } else {
    //         console.log('Flights fetched successfully:');
    //         console.log(JSON.stringify(results));
    //         process.exit(0);
    //     }
    // });

    const graph = Flight.graph(1,0,0).then((results) => {
        //console.log(results)
        process.exit(0);
    }).catch((err) => {
        console.log(err)
    })
    console.log(graph)
}
function testPathReconstrunction() {
    const graph = Flight.graph(1,0,0).then((results) => {
        const {destination, previous} = results;
        console.log(destination)
        //console.log(previous)
        const path = Flight.reconstructPath(previous, 1, 3)
        console.log(path)
    //     for (const [key, value] of path ){
        
    //     console.log("id: " + key + " value: " + value);
    // }
    }).catch((err) => {
        console.log(err)
    })
    // console.log(graph)
    // console.log(typeof(previous))
    // const path = Flight.reconstructPath( previous, 1,8)
    // for (const [key, value] in path ){
        
    //     console.log("id: " + key + " value: " + value);
    // }
}

// Call the test function
//testGetAllFlights();
//testGraphFlights()
testPathReconstrunction()