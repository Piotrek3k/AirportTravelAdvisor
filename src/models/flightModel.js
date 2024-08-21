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
    
            // Filter flights based on the targetDate
            const filteredFlights = flights.filter(item => {
                const datePart = JSON.stringify(item.departure_time).slice(1, 11);
                return datePart === targetDate;
            });
            graph.flights = filteredFlights;
    
            // Run the Yen's K-Shortest Paths algorithm
            const resultPaths = graph.yenKShortestPaths(departure, destination, K, criteria);
    
            // Calculate the total cost and time for each path
            for (let i = 0; i < resultPaths.length; i++) {
                let pathCost = 0;
                let pathTime = 0;
    
                for (let j = 0; j < resultPaths[i].length; j++) {
                    pathCost += +resultPaths[i][j].cost;
                }
    
                const departureTime = new Date(resultPaths[i][0].departure_time).getTime();
                const arrivalTime = new Date(resultPaths[i][resultPaths[i].length - 1].arrival_time).getTime();
                pathTime = arrivalTime - departureTime;
    
                resultPaths[i] = { ...resultPaths[i], totalCost: pathCost, totalTime: pathTime };
            }
            if(criteria){
                resultPaths.sort((a, b) => a.totalTime - b.totalTime); 
            }
            return resultPaths;
    
        } catch (error) {
            // Throw the error to be handled by the caller
            console.log(error)
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

    dijkstra(airport_id, rootPathTime = 0) {
        if(rootPathTime !== 0) {
            console.log(rootPathTime)
        }
        const distances = new Map();
        const toVisit = new Set();
        const previous = new Map();
        toVisit.add(airport_id);
        distances.set(airport_id, {flightCost: 0, flightArrival: rootPathTime});

        this._airports.forEach(n => {
            if (airport_id !== n.id) {
                distances.set(n.id, {flightCost: Infinity, flightArrival: null});
                //console.log(distances.get(2))
                toVisit.add(n.id);
            }
            previous.set(n.id, null);
        });
        return this.dijkstraAlgorithm(distances, toVisit, previous);
    }

    dijkstraAlgorithm(distances, toVisit, previous) {
        const airportValue = findKeyWithLowestValue(distances, toVisit);
        if (airportValue=== null){
            return { distances, previous };
        }
        this.flights.forEach(flight => {
            if (flight.departure_airport_id === airportValue) {
                let cost;
                const departureTime  = new Date(flight.departure_time).getTime();
                const arrivalTime = new Date(flight.arrival_time).getTime();
                    cost = +flight.cost
                   
                    if (+cost + +distances.get(airportValue).flightCost < distances.get(flight.arrival_airport_id).flightCost && +distances.get(airportValue).flightArrival + 7200000 <= departureTime) {
                      
                        distances.set(flight.arrival_airport_id,{ flightCost: +cost + +distances.get(airportValue).flightCost, flightArrival: arrivalTime});
                        previous.set(flight.arrival_airport_id, flight);
                    }
                }
               
        });
        toVisit.delete(airportValue);

        if (toVisit.size === 0) {
            return { distances, previous };
        } else {
            return this.dijkstraAlgorithm(distances, toVisit, previous);
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
            const result = this.dijkstra(departure);
            const initialPath = reconstructPath(result.previous, departure, destination);
        
            // If there's no path, return an empty array
            if (initialPath.length === 0) {
                return KShortestPaths;
            }
        
            KShortestPaths.push(initialPath);
            for (let k = 1; k < K; k++) {

                for (let i = 0; i < KShortestPaths[k - 1].length; i++) {

                    const spurNode = KShortestPaths[k - 1][i].departure_airport_id;
                    const rootPath = KShortestPaths[k - 1].slice(0, i + 1);
        
                    const edgesRemoved = [];
        
                    // Remove edges that are part of the current K shortest paths
                    for (const path of KShortestPaths) {
                        path.forEach((flight) => {
                            
                            if(flight.departure_airport_id === spurNode){
                                        this.removeFlight(flight.id);
                                        edgesRemoved.push(flight);
                            }
                            
                        })
                    }
        
                    // Calculate the spur path from the spur node
                    const rootPathTime = new Date(rootPath[rootPath.length - 2]?.arrival_time).getTime()
                    let spurPathResult;
                    
                    if(spurNode !== departure){
                        spurPathResult = this.dijkstra(spurNode, rootPathTime);
                    }
                    else{
                        spurPathResult = this.dijkstra(spurNode);
                    }
                    const spurPath = reconstructPath(spurPathResult.previous, spurNode, destination);
        
                    if (spurPath.length !== 0) {
                        const totalPath = rootPath.slice(0, rootPath.length - 1).concat(spurPath);
        
                        //Check if the path already exists
                        potentialPaths.push({ path: totalPath, cost: this.calculatePathCost(totalPath, edgesRemoved) });
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
                potentialPaths.sort((a, b) => a.cost - b.cost); 
                let nextPath = potentialPaths.shift().path;
                
                // Ensure that the next path is not a duplicate of any previously found paths
                while(true)
                {
                    if (!this.isDuplicatePath(nextPath, KShortestPaths) ){ 
                    
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
            }
        
            return KShortestPaths
        }
    

    calculatePathCost(path, edgesRemoved) {
        let totalCost = 0;
        const flightsWithRemovedFlights = this.flights.concat(edgesRemoved)
        for (let i = 0; i < path.length; i++) {
            const flight = flightsWithRemovedFlights.find(f => f.id === path[i].id);
                totalCost += +flight.cost;
        }
        return totalCost;
    }

    removeFlight(edge) {
        this.flights = this.flights.filter(f => !(f.id === edge));
    }

    isDuplicatePath(newPath, existingPaths) {
        return existingPaths.some(path => path.length === newPath.length &&
            path.every((flight, index) => flight.departure_airport_id === newPath[index].departure_airport_id &&
                flight.arrival_airport_id === newPath[index].arrival_airport_id &&
                flight.id === newPath[index].id));
    }
    // 
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
        if(toVisit.size === 1) {
        }
      if (value.flightCost < lowestValue&& toVisit.has(key)) {
        lowestValue = value.flightCost;
        lowestKey = key;
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
