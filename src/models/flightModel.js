const db = require('../../config/dbConfig');
const Airport = require('./airportModel');

class Flight {
    static getAll(callback){
        db.query(`SELECT * FROM flights`, callback)
    }
    static getById(id, callback) {
        db.query('SELECT * FROM flights WHERE id = ?', [id], callback);
    }

    static create (flight, callback) {
        const { flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time } = flight;
        db.query('INSERT INTO flights (flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time], callback);
    }

    static update(id, flight, callback) {
        const { flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time } = flight;
        db.query('UPDATE flights SET flight_number = ?, airline = ?, departure_airport_id = ?, arrival_airport_id = ?, cost = ?, departure_time = ?, arrival_time = ? WHERE id = ?', 
            [flight_number, airline, departure_airport_id, arrival_airport_id, cost, departure_time, arrival_time, id], callback);
    }

    static delete(id, callback) {
        db.query('DELETE FROM flights WHERE id = ?', [id], callback);
    }
    // Find K-shortest paths between departure and destination airports
    static async findRoute (departure, destination, K, criteria, targetDate) {
        try {
            const graph = new Graph();
    
            // Fetch all airports from the database
            const airports = await new Promise((resolve, reject) => {
                Airport.getAll((error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
            graph.airports = airports;
    
            // Fetch all flights from the database
            const flights = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM flights', (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
    
            // Filter flights based on the target date
            const filteredFlights = flights.filter(item => {
                const datePart = JSON.stringify(item.departure_time).slice(1, 11);
                return datePart === targetDate;
            });
            graph.flights = filteredFlights;
    
            // Run Yen's K-Shortest Paths algorithm
            const resultPaths = graph.yenKShortestPaths(departure, destination, K, criteria);
    
            // Calculate the total cost and time for each path
            for (let i = 0; i < resultPaths.length; i++) {
                let pathCost = 0;
                let pathTime = 0;
    
                // Calculate total cost of the path
                for (let j = 0; j < resultPaths[i].length; j++) {
                    pathCost += +resultPaths[i][j].cost;
                }
    
                // Calculate total time of the path
                const departureTime = new Date(resultPaths[i][0].departure_time).getTime();
                const arrivalTime = new Date(resultPaths[i][resultPaths[i].length - 1].arrival_time).getTime();
                pathTime = arrivalTime - departureTime;
    
                // Store the total cost and time with the path
                resultPaths[i] = { ...resultPaths[i], totalCost: pathCost, totalTime: pathTime };
            }
            if(criteria) 
            {
                return resultPaths.sort((a, b) => a.totalTime - b.totalTime);
            }
            return resultPaths;
    
        } catch (error) {
            // Log and throw the error for the caller to handle
            //console.log(error);
            throw error;
        }
    }
};

// Class representing a graph using adjacency list representation
class Graph {
    constructor() {
        // Initialize arrays to store airports and flights
        this._flights = [];
        this._airports = [];
    }

    // Getters and setters for airports and flights
    get airports() {
        return this._airports;
    }
    set airports(value) {
        this._airports = value;
    }
    get flights() {
        return this._flights;
    }
    set flights(value) {
        this._flights = value;
    }

    // Add an airport to the graph
    addAirport(airport) {
        this._airports.push(airport);
    }

    // Add a flight to the graph
    addflight(flight) {
        this._flights.push(flight);
    }

    // Dijkstra's algorithm to find the shortest path from a source airport
    dijkstra(airport_id, rootPathTime = 0) {
        const distances = new Map();
        const toVisit = new Set();
        const previous = new Map();
        toVisit.add(airport_id);
        distances.set(airport_id, { flightCost: 0, flightArrival: rootPathTime });

        // Initialize distances and set the previous nodes
        this._airports.forEach(n => {
            if (airport_id !== n.id) {
                distances.set(n.id, { flightCost: Infinity, flightArrival: null });
                toVisit.add(n.id);
            }
            previous.set(n.id, null);
        });

        return this.dijkstraAlgorithm(distances, toVisit, previous);
    }

    // Helper function to perform Dijkstra's algorithm
    dijkstraAlgorithm(distances, toVisit, previous) {
        const airportValue = findKeyWithLowestValue(distances, toVisit);
        if (airportValue === null) {
            return { distances, previous };
        }

        // Explore each flight from the current airport
        this.flights.forEach(flight => {
            if (flight.departure_airport_id === airportValue) {
                const departureTime = new Date(flight.departure_time).getTime();
                const arrivalTime = new Date(flight.arrival_time).getTime();
                const cost = +flight.cost;

                // Check if this path is shorter and update distances and previous nodes
                if (+cost + +distances.get(airportValue).flightCost < distances.get(flight.arrival_airport_id).flightCost &&
                    +distances.get(airportValue).flightArrival + 7200000 <= departureTime) {
                    distances.set(flight.arrival_airport_id, {
                        flightCost: +cost + +distances.get(airportValue).flightCost,
                        flightArrival: arrivalTime
                    });
                    previous.set(flight.arrival_airport_id, flight);
                }
            }
        });

        toVisit.delete(airportValue);

        // Recursively perform the algorithm until all nodes are visited
        if (toVisit.size === 0) {
            return { distances, previous };
        } else {
            return this.dijkstraAlgorithm(distances, toVisit, previous);
        }
    }

    // Yen's K-Shortest Paths algorithm to find K shortest paths
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

        // Loop to find K shortest paths
        for (let k = 1; k < K; k++) {
            for (let i = 0; i < KShortestPaths[k - 1].length; i++) {
                const spurNode = KShortestPaths[k - 1][i].departure_airport_id;
                const rootPath = KShortestPaths[k - 1].slice(0, i + 1);

                const edgesRemoved = [];

                // Remove edges that are part of the current K shortest paths
                for (const path of KShortestPaths) {
                    path.forEach((flight) => {
                        if (flight.departure_airport_id === spurNode) {
                            this.removeFlight(flight.id);
                            edgesRemoved.push(flight);
                        }
                    });
                }

                // Calculate the spur path from the spur node
                const rootPathTime = new Date(rootPath[rootPath.length - 2]?.arrival_time).getTime();
                let spurPathResult;
                if (spurNode !== departure) {
                    spurPathResult = this.dijkstra(spurNode, rootPathTime);
                } else {
                    spurPathResult = this.dijkstra(spurNode);
                }
                const spurPath = reconstructPath(spurPathResult.previous, spurNode, destination);

                // If the spur path exists, combine it with the root path
                if (spurPath.length !== 0) {
                    const totalPath = rootPath.slice(0, rootPath.length - 1).concat(spurPath);
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
            while (true) {
                if (!this.isDuplicatePath(nextPath, KShortestPaths)) {
                    KShortestPaths.push(nextPath);
                    break;
                } else if (potentialPaths.length === 0) {
                    break;
                } else {
                    nextPath = potentialPaths.shift().path;
                }
            }
        }

        return KShortestPaths;
    }

    // Calculate the total cost of a path
    calculatePathCost(path, edgesRemoved) {
        let totalCost = 0;
        const flightsWithRemovedFlights = this.flights.concat(edgesRemoved);
        for (let i = 0; i < path.length; i++) {
            const flight = flightsWithRemovedFlights.find(f => f.id === path[i].id);
            totalCost += +flight.cost;
        }
        return totalCost;
    }

    // Remove a flight from the graph by its ID
    removeFlight(edge) {
        this.flights = this.flights.filter(f => !(f.id === edge));
    }

    // Check if a path is a duplicate of any existing paths
    isDuplicatePath(newPath, existingPaths) {
        return existingPaths.some(path => path.length === newPath.length &&
            path.every((flight, index) => flight.departure_airport_id === newPath[index].departure_airport_id &&
                flight.arrival_airport_id === newPath[index].arrival_airport_id &&
                flight.id === newPath[index].id));
    }
}

// Function to find the key with the lowest value in a map
function findKeyWithLowestValue(distances, toVisit) {
    let lowestValue = Infinity;
    let lowestKey = null;
  
    for (const [key, value] of distances) {
      if (value.flightCost < lowestValue && toVisit.has(key)) {
        lowestValue = value.flightCost;
        lowestKey = key;
      }
    }
  
    return lowestKey;
}

// Function to reconstruct a path from the 'previous' map
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
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (let i = 0; i < this.length; i++) {
        if (Array.isArray(this[i]) && Array.isArray(array[i])) {
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
};

// Hide the equals method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

module.exports = Flight;
