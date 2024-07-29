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
function testYensAlgorithm() {
    console.log("---")
    const res = Flight.graph(1,8,5,0).then((results) => {

        //console.log(JSON.stringify(results))
        console.log("aaaaaaaaaaa")
        
    //     for (const [key, value] of path ){
        
    //     console.log("id: " + key + " value: " + value);
    // }

    results.forEach((route) => {
        let routeCost = 0
        let routeTrace = []
        let routeIds = []
        for(let i = 0; i < route.length; i++) {
            routeCost += +route[i].cost
            routeTrace.push([route[i].departure_airport_id, route[i].arrival_airport_id])
            routeIds.push(route[i].id)
        }
    
        console.log(routeCost)
        console.log(routeIds)
        console.log(JSON.stringify(routeTrace))
    })
    process.exit(0)
    }).catch((err) => {
        console.log(err)
        process.exit(1)
    }) 
    console.log(res)
}

// Call the test function
//testGetAllFlights();
//testGraphFlights()
//testPathReconstrunction()
testYensAlgorithm()