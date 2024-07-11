const db = require('../../config/dbConfig');
const Airport = require('./airportModel');

const Flight = {
    getAll: (callback) => {
        db.query(`SELECT * FROM flights`, callback)
    },
    findRoute: (departure, destination, departure_day, criteria, callback) => {
        const graph = []
        db.query(`SELECT * FROM flights`, (error, result) => {
            if (error) {
                return callback(error);
            }
            result.forEach((flight) => {

            })

        })
    },
    graph: async (departure, destination, criteria) => {
        try {
            // Initialize a new Graph instance
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
            console.log(35 + airports)
            // Fetch all flights
            const flights = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM flights', (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
            console.log(45 + flights)
            graph.flights = flights;

            // Run the dijkstra algorithm with the provided departure and criteria
            const result = graph.dijkstra(departure, criteria);

            const {distances, previous} = result;
            console.log(result)
            const path = Flight.reconstructPath(previous, 1, 8);
            //console.log(JSON.stringify(distances))
            console.log(path)
                for (const [key, value] of distances ){
            
            console.log("id: " + key + " value: " + value);
        }
            return result;

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // or return an appropriate error response
        }
    },
    reconstructPath: (previous, start, end) => {
        const path = [];
        let current = end;
    
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }
    
        if (path[0] !== start) {
            return []; // No valid path found
        }
    
        return path;
    }
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
        if (this._airports.includes(graphflight._airport1) && this._airports.includes(graphflight._airport2)) {
            this._flights.push(flight);
            // this._flights.sort(); // Sort flights for consistent ordering.
        } else {
            throw new Error("Graph does not contain at least one of the provided airports");
        }
    }

    /**
     * Method to perform a depth-first search (DFS) on the graph.
     * @param {Array} [visited=[]] - An array to store visited airports.
     * @param {Array} [toVisit=[]] - An array to store airports to visit.
     * @param {airport} [airport=this._airports[0]] - The starting airport for the search.
     * @returns {Array} The visited airports in DFS order.
     */
    // depthFirstSearch(visited = [], toVisit = [], airport = this._airports[0]) {
    //     visited.push(airport.value)    // adding current airport to visited array
    //     toVisit.shift() // removing current airport from toVisit array    
    //     let newToVisit = [] // intializing another array, that will collect all the airports connected with current airport (besides those in toVisit array)
    //     this._flights.forEach(flight => {   // checking for every flight if it starts with the current airport   
    //         if(flight.airport1.value === airport.value){    
    //             if(!toVisit.includes(flight.airport2) && !visited.includes(flight.airport2.value)){   // checking if the new airport connected to current airport has been visited or is in the toVisit array
    //                 newToVisit.push(flight.airport2) // adding second airport from current flight to newToVisit array
    //             }
    //         }
    //     });
    //     toVisit = newToVisit.concat(toVisit)    // combining newToVisit and ToVisit that way the search is depth-first
    //     if(toVisit.length === 0){
    //         return visited  // returning visited if toVisit.length is 0 
    //     }
    //     else{
    //         return this.depthFirstSearch(visited,toVisit,toVisit[0])    // recursivly going to first airport from toVisit array
    //     }
    // }

    /**
     * Method to perform a breadth-first search (BFS) on the graph.
     * @param {Array} [visited=[]] - An array to store visited airports.
     * @param {Array} [toVisit=[]] - An array to store airports to visit.
     * @param {airport} [airport=this._airports[0]] - The starting airport for the search.
     * @returns {Array} The visited airports in BFS order.
     */
    // breadthFirstSearch(visited = [], toVisit = [], airport = this._airports[0]) {
    //     visited.push(airport.value)    // adding current airport to visited array
    //     toVisit.shift() // removing current airport from toVisit array
    //     this._flights.forEach(flight => {   // checking for every flight if it starts with the current airport
    //         if(flight.airport1.value === airport.value){
    //             if(!toVisit.includes(flight.airport2) && !visited.includes(flight.airport2.value)){   // checking if the new airport connected to current airport has been visited or is in the toVisit array
    //                 toVisit.push(flight.airport2)    // pushing second airport from current flight to toVisit array so the search is breadth-first
    //             }
    //         }
    //     });
    //     if(toVisit.length === 0){
    //         return visited  // returning visited if toVisit.length is 0
    //     }
    //     else{
    //         return this.breadthFirstSearch(visited,toVisit,toVisit[0])  // recursivly going to first airport from toVisit array
    //     }
    // }

    /**
     * Method to perform Dijkstra's algorithm to find the shortest paths from a given airport.
     * @param {airport} airport - The starting airport for Dijkstra's algorithm.
     * @returns {Map} A map containing the shortest distances from the provided airport to every other airport.
     */
    dijkstra(airport_id, criteria) {
        // dijkstra algorithm to calculate the shortest path between two airports
        const distances = new Map() // initializing new map with every airport and distance to that airport
        const toVisit = new Set()   // initializing new set with every airport that hasn't been visited yet
        const previous = new Map()
        toVisit.add(airport_id)     // adding initial airport to toVisit set
        // console.log("................" + JSON.stringify(toVisit))
        // console.log(toVisit.size)

        distances.set(airport_id,0) // adding initial airport to distances map and giving it 0 as distance

        this._airports.forEach(n => {  // adding each airport to toVisit set and distance map with distance of infinity
            if(airport_id !== n.id){
                distances.set(n.id,Infinity)
                toVisit.add(n.id)
            }
            previous.set(n.id, null)
        })
        //console.log("................" + JSON.stringify(toVisit))
        //console.log(toVisit.size)
        return this.dijkstraAlgorithm(distances, toVisit, previous, criteria) // returning default dijkstra algorithm function
    }
    /**
     * Helper method to implement Dijkstra's algorithm.
     * @param {Map} distances - A map containing distances to airports.
     * @param {Set} toVisit - A set containing airports to visit.
     * @returns {Map} A map containing the shortest distances from the provided airport to every other airport.
     */
    dijkstraAlgorithm(distances, toVisit, previous, criteria) {
        const airportValue = findKeyWithLowestValue(distances, toVisit); // Value of current airport is the lowest value in distances map that hasn't been visited.
        // console.log("----------------" + airportValue)
        // console.log("size: " + previous.size)
        // for (const [key, value] of previous ){
        
        //     console.log("id: " + key + " value: " + value);
        // }
        if(criteria) {
            //console.log("criteria")
            this.flights.forEach(flight => {
                //console.log("airval: " + airportValue);
                const departureTime = new Date(flight.departure_time).getTime();
                const arrivalTime = new Date(flight.arrival_time).getTime();
                const timeDifference = arrivalTime - departureTime;
                // Searching for every flight that connects current airport with another airport and checking if the sum of the cost of that flight and value in distance map is lower than the distance in the distance map.
                if (flight.departure_airport_id === airportValue && timeDifference + distances.get(airportValue) < distances.get(flight.arrival_airport_id)) {
                    distances.set(flight.arrival_airport_id, timeDifference + distances.get(airportValue)); // If it is lower, then the distance in the distance map is replaced by a lower value.
                    previous.set(flight.arrival_airport_id, airportValue)
                }
            });
        }
        else{
            this.flights.forEach(flight => {
                
                // Searching for every flight that connects current airport with another airport and checking if the sum of the cost of that flight and value in distance map is lower than the distance in the distance map.
                if (flight.departure_airport_id === airportValue && +flight.cost + +distances.get(airportValue) < distances.get(flight.arrival_airport_id)) {
                    //console.log("=================================")
                    distances.set(flight.arrival_airport_id, +flight.cost + +distances.get(airportValue)); // If it is lower, then the distance in the distance map is replaced by a lower value.
                    previous.set(flight.arrival_airport_id, airportValue)
                }
            });
        }
        
        toVisit.delete(airportValue); // Removing current airport from toVisit set.
        //console.log("toVisit: " + toVisit.size);

        if (toVisit.size === 0) {
            // When all airports were visited, return distances map as shortest distances between provided airport and every other airport in the graph.
            return {distances, previous};
        } else {
            // Return dijkstraAlgorithm for the next airport with the lowest value in the distance map that hasn't been visited.
            return this.dijkstraAlgorithm(distances, toVisit, previous, criteria);
        }
    }
    /**
     * // Method to find the shortest path using BFS.
     * @param {Node} startingNode - The starting node for the search.
     * @param {Node} targetNode - The target node to find the shortest path to.
     * @param {Node} [currentNode=startingNode] - The current node being processed.
     * @param {Array} [visited=[]] - An array to store visited nodes.
     * @param {Array} [toVisit=[]] - An array to store nodes to visit.
     * @param {Map} [predecessors=new Map()] - A map to store predecessors of nodes in the shortest path.
     * @returns {Array} The shortest path from startingNode to targetNode.
     */
    // breadthFirstSearch_ShortestPath(startingNode, targetNode, currentNode = startingNode, visited = [], toVisit = [], predecessors = new Map()) {
    //     visited.push(currentNode.value)    // adding current node to visited array
    //     toVisit.shift() // removing current node from toVisit array
    //     this._edges.forEach(edge => {   // checking for every edge if it starts with the current node
    //         if(edge.node1.value === currentNode.value){
    //             if(!toVisit.includes(edge.node2) && !visited.includes(edge.node2.value)){   // checking if the new node connected to current node has been visited or is in the toVisit array
    //                 toVisit.push(edge.node2)    // pushing second node from current edge to toVisit array so the search is breadth-first
    //                 predecessors.set(edge.node2,currentNode); // add second node to predecessors map 
    //             }
    //         }
    //     });
    //     if(currentNode === targetNode){
    //         const path = [];
    //         let step = targetNode;
    //         while (step !== startingNode) { // recreating the path between starting node and target node
    //             path.unshift(step);
    //             step = predecessors.get(step);
    //         }
    //         path.unshift(startingNode);
    //         return path; // returning visited if toVisit.length is 0
    //     }
    //     else{
    //         return this.breadthFirstSearch_ShortestPath(startingNode,targetNode,toVisit[0],visited,toVisit,predecessors)  // recursivly going to first node from toVisit array
    //     }
    // }
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
         //console.log("key: " + key + ", value: " + value)
        // console.log(value < lowestValue && toVisit.has(key))
      if (value < lowestValue && toVisit.has(key)) {
        lowestValue = value;
        lowestKey = key;
      }
    }
  
    return lowestKey ;
}



module.exports = Flight
//module.exports.reconstructPath