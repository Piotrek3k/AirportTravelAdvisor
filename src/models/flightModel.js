const db = require('../../config/dbConfig');
const Airport = require('./airportModel');

const Flight = {
    getAll: (callback) => {
        db.query(`SELECT * FROM flights`, callback)
    },
    getById: (id, callback) => {
        db.query('SELECT * FROM flights WHERE id = ?', [id], callback);
    },

    create: (flight, callback) => {
        const { flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time } = flight;
        db.query('INSERT INTO flights (flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time], callback);
    },

    update: (id, flight, callback) => {
        const { flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time } = flight;
        db.query('UPDATE flights SET flight_number = ?, airline = ?, departure_airport_id = ?, arrival_airport_id = ?, cost = ?, departure_time = ?, arrival_time = ? WHERE id = ?', 
            [flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM flights WHERE id = ?', [id], callback);
    },
    findRoute: async (departure, destination, K, criteria, targetDate) => {
        console.log("----------------------------------")
        try {
            const graph = new Graph();

            // Fetch all airports
            const airports = await new Promise((resolve, reject) => {
                Airport.getAll((error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
            graph.airports = airports;

            // Fetch all flights
            const flights = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM flights', (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
            const filteredFlights = flights.filter(item => {
                //console.log(JSON.stringify(item))
                const datePart = JSON.stringify(item.departure_time).slice(1,11);
                //console.log(datePart)
                console.log(datePart === targetDate)
                return datePart === targetDate;
              });
            graph.flights = filteredFlights;

            // Run the dijkstra algorithm with the provided departure and criteria
            const result = graph.dijkstra(departure, criteria);

            const {distances, previous} = result;
            const path = reconstructPath(result.previous, departure, destination) 
            const result2 = graph.yenKShortestPaths(departure,destination,K, criteria)

           const resultF = result2.filter(path => graph.isValidPath(path)) 
           let pathsAndCosts = result2.forEach(path => {
                let pathCost;
                let pathTime;
                path.forEach(flight => {
                    pathCost += +flight.cost
                })
           })
            return result2

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}
/**
 * Class representing a graph using adjacency list representation.
 */
class Graph {
    /**
     * Creates a new Graph instance.
     */
    constructor() {
        /** 
         * An array to store the flights of the graph.
         * @type {Graphflight[]}
         * @private
         */
        this._flights = [];

        /** 
         * An array to store the airports of the graph.
         * @type {airport[]}
         * @private
         */
        this._airports = [];
    }

    get airports() {
        return this._airports
    }
    set airports(value) {
        this._airports = value
    }
    get flights() {
        return this._flights
    }
    set flights(value) {
        this._flights = value
    }
    /**
     * Method to add a airport to the graph.
     * @param {airport} airport - The airport to be added.
     */
    addAirport(airport) {
        this._airports.push(airport);
        // this._airports.sort(); // Sort airports for consistent ordering.
    }

    /**
     * Method to add an flight to the graph.
     * @param {Graphflight} graphflight - The flight to be added.
     * @throws {Error} If the graph does not contain at least one of the provided airports.
     */
    addflight(flight) {

        this._flights.push(flight);
    }

    dijkstra(airport_id, criteria, rootPathTime = 0) {
        const distances = new Map();
        const toVisit = new Set();
        const previous = new Map();
        toVisit.add(airport_id);
        distances.set(airport_id, {flightCost: 0, flightArrival: rootPathTime});

        this._airports.forEach(n => {
            if (airport_id !== n.id) {
                distances.set(n.id, {flightCost: Infinity, flightArrival: 0});
                //console.log(distances.get(2))
                toVisit.add(n.id);
            }
            previous.set(n.id, null);
        });
        return this.dijkstraAlgorithm(distances, toVisit, previous, criteria);
    }

    dijkstraAlgorithm(distances, toVisit, previous, criteria) {
        const airportValue = findKeyWithLowestValue(distances, toVisit);
        // for(let jj =1; jj<11; jj++){
        //     console.log(jj, distances.get(jj))
        // }
        console.log("--------------------")
        if (airportValue=== null){
            return { distances, previous };
        }
        this.flights.forEach(flight => {
            if (flight.departure_airport_id === airportValue) {
                let cost;
                const departureTime = new Date(flight.departure_time).getTime();
                const arrivalTime = new Date(flight.arrival_time).getTime();
                if (criteria === 1) {
                    cost = arrivalTime - departureTime;
                } else {
                    cost = +flight.cost;
                }
                if(flight.id === 183) {
                    // console.log("aaaaaaaaaaaaaaaaaasssssssssssssssssssssssssssssssssssss")
                    // console.log("first part: ", +cost + +distances.get(airportValue).flightCost)
                    // console.log("second part: ", distances.get(flight.arrival_airport_id).flightCost)
                    // console.log("third part: ", distances.get(airportValue).flightArrival + 7200000)
                    // console.log("fourth part: ", departureTime)
                    // previous.forEach(something => {
                    //     console.log(JSON.stringify(something))
                    // })
                }
                // adding the value of two hours to the arrival time
                if (+cost + +distances.get(airportValue).flightCost < distances.get(flight.arrival_airport_id).flightCost && +distances.get(airportValue).flightArrival + 7200000 <= departureTime) {
                    //console.log("11111111")
                    // if(flight.id === 108 || flight.id === 133) {
                    //     console.log(flight.id)
                    //     console.log(departureTime, +distances.get(airportValue).flightArrival + 7200000 )
                    //     console.log(distances.get(airportValue))
                    //     console.log(airportValue)
                    //     for(let jj =1; jj<11; jj++){
                    //         console.log(distances.get(jj))
                    //     }
                    // }
                    if(airportValue === 7) {
                        // for(let jj =1; jj<11; jj++){
                        //             console.log(jj, distances.get(jj))
                        //         }
                    }
                    distances.set(flight.arrival_airport_id,{ flightCost: +cost + +distances.get(airportValue).flightCost, flightArrival: arrivalTime});
                    previous.set(flight.arrival_airport_id, flight);
                }
            }
        });
       // console.log("********************************")
        toVisit.delete(airportValue);

        if (toVisit.size === 0) {
            return { distances, previous };
        } else {
            return this.dijkstraAlgorithm(distances, toVisit, previous, criteria);
        }
    }

     /**
     * Yen's K-Shortest Paths algorithm.
     * @param {number} departure - The departure airport ID.
     * @param {number} destination - The destination airport ID.
     * @param {number} K - Number of shortest paths to find.
     * @param {string} criteria - Criteria for pathfinding (e.g., cost, time).
     * @returns {Array} An array of K shortest paths.
     */

        yenKShortestPaths(departure, destination, K, criteria) {
            const KShortestPaths = [];
            const potentialPaths = [];
        
            // Find the initial shortest path
            const result = this.dijkstra(departure, criteria);
            //console.log(JSON.stringify(result.previous))
            const initialPath = reconstructPath(result.previous, departure, destination);
            //console.log(JSON.stringify(initialPath))
        
            // If there's no path, return an empty array
            if (initialPath.length === 0) {
                return KShortestPaths;
            }
        
            KShortestPaths.push(initialPath);
            //console.log(KShortestPaths)
            for (let k = 1; k < K; k++) {
                console.log("///////////////////////////////////////////////")
                // console.log(k)
                // KShortestPaths.forEach(path => {
                //     let way = []
                //     path.forEach(p => {
                //         way.push(p.id)
                //     })
                //     console.log(way)
                // })
                // console.log(KShortestPaths[k - 1])
                for (let i = 0; i < KShortestPaths[k - 1].length; i++) {

                    const spurNode = KShortestPaths[k - 1][i].departure_airport_id;
                    const rootPath = KShortestPaths[k - 1].slice(0, i + 1);
        
                    const edgesRemoved = [];
        
                    // Remove edges that are part of the current K shortest paths
                    for (const path of KShortestPaths) {
                        path.forEach((flight) => {
                            // for(let l = 0; l < rootPath.length; l++)
                            // {
                            //     if(flight.id === rootPath[l].id){
                            //         //console.log(flight.id)
                            //         this.removeFlight(flight.id);
                            //         edgesRemoved.push(flight);
                                    
                            //     }
                            // }
                            console.log(spurNode)
                            if(flight.departure_airport_id === spurNode){
                                        this.removeFlight(flight.id);
                                        edgesRemoved.push(flight);
                                        console.log(flight.id)
                            }
                            
                        })
                        //console.log(JSON.stringify(edgesRemoved)) tu jest git
                    }
        
                    // Calculate the spur path from the spur node
                    console.log( JSON.stringify(rootPath))
                    const rootPathTime = new Date(rootPath[rootPath.length - 1].arrival_time).getTime() + 7200000
                    let spurPathResult;
                    console.log(departure)
                    
                    // if(spurNode !== departure){
                    //     spurPathResult = this.dijkstra(spurNode, criteria, rootPathTime);
                    // }
                    // else{
                    //     spurPathResult = this.dijkstra(spurNode, criteria);
                    // }
                    spurPathResult = this.dijkstra(spurNode, criteria);
                    const spurPath = reconstructPath(spurPathResult.previous, spurNode, destination);
        
                    if (spurPath.length !== 0) {
                        const totalPath = rootPath.slice(0, rootPath.length - 1).concat(spurPath);
        
                        //Check if the path already exists
                        if (!this.isDuplicatePath(totalPath, potentialPaths)) {
                            potentialPaths.push({ path: totalPath, cost: this.calculatePathCost(totalPath, criteria, edgesRemoved) });
                        }
                        //potentialPaths.push({ path: totalPath, cost: this.calculatePathCost(totalPath, criteria, edgesRemoved) });
                    }
        
                    // Add back the removed edges
                    for (const edge of edgesRemoved) {
                        this.addflight(edge);
                    }
                }
        
                if (potentialPaths.length === 0) {
                    break;
                }
        
                // Sort the potential paths by total cost
                potentialPaths.sort((a, b) => a.cost - b.cost); // dopisać jesli criteria to czas
                potentialPaths.forEach(potentialPath => {
                    console.log(JSON.stringify(potentialPath.path), potentialPath.cost)
                })
                let nextPath = potentialPaths.shift().path;
                //console.log(JSON.stringify(nextPath))
                
                // Ensure that the next path is not a duplicate of any previously found paths
                while(true)
                {
                    if (!this.isDuplicatePath(nextPath, KShortestPaths) ){ //&&this.isValidPath(nextPath)) {
                    
                        KShortestPaths.push(nextPath);
                        break;
                    }
                    else if (potentialPaths.length === 0) {
                        break;
                    }
                    else {
                        nextPath = potentialPaths.shift().path;
                    }
                }
                // if (potentialPaths.length === 0) {
                //     break;
                // }
                
                //console.log(JSON.stringify(KShortestPaths))
            }
        
            return KShortestPaths
        }
    
    // /**
    //  * Helper method to calculate the total cost of a path.
    //  * @param {Array} path - An array of airport IDs representing the path.
    //  * @param {string} criteria - Criteria for pathfinding (e.g., cost, time).
    //  * @returns {number} The total cost of the path.
    //  */
    calculatePathCost(path, criteria, edgesRemoved) {
        let totalCost = 0;
       // console.log(JSON.stringify(path))
        const flightsWithRemovedFlights = this.flights.concat(edgesRemoved)
        for (let i = 0; i < path.length; i++) {
            const flight = flightsWithRemovedFlights.find(f => f.id === path[i].id);
            // console.log(JSON.stringify(this._flights))
            // console.log(flight)
            if (criteria === 1) {
                const departureTime = new Date(flight.departure_time).getTime();
                const arrivalTime = new Date(flight.arrival_time).getTime();
                totalCost += (arrivalTime - departureTime);
            } else {
                totalCost += +flight.cost;
            }
        }
        //console.log(totalCost)
        return totalCost;
    }

    removeFlight(edge) {
        //console.log(edge)
        this.flights = this.flights.filter(f => !(f.id === edge));
    }

    isDuplicatePath(newPath, existingPaths) {
        return existingPaths.some(path => path.length === newPath.length &&
            path.every((flight, index) => flight.departure_airport_id === newPath[index].departure_airport_id &&
                flight.arrival_airport_id === newPath[index].arrival_airport_id &&
                flight.id === newPath[index].id));
    }
    isValidPath(path) {
        console.log(JSON.stringify(path));
        if(path.length === 1) {
            return true;
        }
        for(let i = 0; i < path.length -1; i++) {
            console.log(JSON.stringify(path[i]));
            const getArrivalTime = new Date(path[i].arrival_time).getTime();
            console.log(new Date(path[i].arrival_time), getArrivalTime + 7200000)
            const getDepartureTime = new Date(path[i+1].departure_time).getTime()
            console.log(new Date(path[i+1].departure_time), getDepartureTime)
            if(getArrivalTime + 7200000 > getDepartureTime) {
                return false
            }
        }
        return true
    }
}
/**
 * // function to find the lowest value in a map with corresponding key
 * @param {Map} distances - The map containing distances.
 * @param {Set} toVisit - The set containing nodes to visit.
 * @returns {any} The key with the lowest value.
 */
function findKeyWithLowestValue(distances, toVisit) {
    let lowestValue = Infinity;
    let lowestKey = null;
  
    for (const [key, value] of distances) {
        //  console.log("key: " + key + ", value: " + JSON.stringify(value))
        // console.log(value.flightCost < lowestValue && toVisit.has(key))
        // console.log("size: " + toVisit.size)
        // console.log(lowestValue)
        // console.log(lowestKey)
        if(toVisit.size === 1) {
        //     const iterator1 = toVisit.entries();
        //     console.log("czy to ta trójka: ", value.flightCost < lowestValue)
        //     console.log("aaaaaa" + value.flightCost)
        //     console.log("eeee", toVisit.has(key) )
        //     for (const entry of iterator1) {
        //     console.log(entry);
        //     //console.log(distances(entry))
        //     // Expected output: Array [42, 42]
        //     // Expected output: Array ["forty two", "forty two"]
        // }
        }
      if (value.flightCost < lowestValue&& toVisit.has(key)) {
        lowestValue = value.flightCost;
        lowestKey = key;
        //console.log("lowestKey: " + lowestKey)
      }
    }
  
    return lowestKey ;
}
function reconstructPath(previous, start, end) {
    const path = [];
    let current = end;

    while (previous.get(current) !== null) {
        const flight = previous.get(current);
        path.unshift(flight);
        current = flight.departure_airport_id;
    }

    return path;
}

// Utility function to compare arrays
Array.prototype.equals = function (array) {
    // If the other array is a falsy value, return false
    if (!array)
        return false;

    // Compare lengths 
    if (this.length != array.length)
        return false;

    for (let i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (Array.isArray(this[i])&& Array.isArray(array[i])) {
            // Recursively compare nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // If not an array, compare values
            return false;
        }
    }
    return true;
};

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });


module.exports = Flight
//module.exports.reconstructPath
