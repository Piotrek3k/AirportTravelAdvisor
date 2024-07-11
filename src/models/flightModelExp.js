const db = require('../../config/dbConfig');

class GraphEdge {
    /**
     * Creates a graph edge connecting two nodes with an optional cost.
     * @param {Node} node1 - The first node of the edge.
     * @param {Node} node2 - The second node of the edge.
     * @param {number|null} [cost=null] - The cost associated with the edge (optional).
     */
    constructor(node1, node2, cost = null) {
        /** 
         * The first node of the edge.
         * @type {Node}
         * @private
         */
        this._node1 = node1; // Initialize the first node of the edge.
        
        /** 
         * The second node of the edge.
         * @type {Node}
         * @private
         */
        this._node2 = node2; // Initialize the second node of the edge.
        
        /** 
         * The cost associated with the edge (optional).
         * @type {number|null}
         * @private
         */
        this._cost = cost;   // Initialize the cost of the edge (optional).
    }

    /**
     * Setter for the first node of the edge.
     * @param {Node} node - The node to set as the first node.
     */
    set node1(node) {
        this._node1 = node;
    }

    /**
     * Setter for the second node of the edge.
     * @param {Node} node - The node to set as the second node.
     */
    set node2(node) {
        this._node2 = node;
    }

    /**
     * Setter for the cost of the edge.
     * @param {number|null} cost - The cost to set.
     */
    set cost(cost) {
        this._cost = cost;
    }

    /**
     * Getter for the first node of the edge.
     * @return {Node} The first node of the edge.
     */
    get node1() {
        return this._node1;
    }

    /**
     * Getter for the second node of the edge.
     * @return {Node} The second node of the edge.
     */
    get node2() {
        return this._node2;
    }

    /**
     * Getter for the cost of the edge.
     * @return {number|null} The cost of the edge.
     */
    get cost() {
        return this._cost;
    }

    /**
     * Method to return a string representation of the edge.
     * @return {string} A string representation of the edge.
     */
    toString() {
        if (this._cost) {
            return `${this._node1._value}; ${this._node2._value}; cost: ${this._cost}`;
        } else {
            return `${this._node1._value}; ${this._node2._value}`;
        }
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
         * An array to store the edges of the graph.
         * @type {GraphEdge[]}
         * @private
         */
        this._edges = [];

        /** 
         * An array to store the nodes of the graph.
         * @type {Node[]}
         * @private
         */
        this._nodes = [];
    }

    /**
     * Method to add a node to the graph.
     * @param {Node} node - The node to be added.
     */
    addNode(node) {
        this._nodes.push(node);
        this._nodes.sort(); // Sort nodes for consistent ordering.
    }

    /**
     * Method to add an edge to the graph.
     * @param {GraphEdge} graphEdge - The edge to be added.
     * @throws {Error} If the graph does not contain at least one of the provided nodes.
     */
    addEdge(graphEdge) {
        if (this._nodes.includes(graphEdge._node1) && this._nodes.includes(graphEdge._node2)) {
            this._edges.push(graphEdge);
            this._edges.sort(); // Sort edges for consistent ordering.
        } else {
            throw new Error("Graph does not contain at least one of the provided nodes");
        }
    }

    /**
     * Method to perform a depth-first search (DFS) on the graph.
     * @param {Array} [visited=[]] - An array to store visited nodes.
     * @param {Array} [toVisit=[]] - An array to store nodes to visit.
     * @param {Node} [node=this._nodes[0]] - The starting node for the search.
     * @returns {Array} The visited nodes in DFS order.
     */
    depthFirstSearch(visited = [], toVisit = [], node = this._nodes[0]) {
        visited.push(node.value)    // adding current node to visited array
        toVisit.shift() // removing current node from toVisit array    
        let newToVisit = [] // intializing another array, that will collect all the nodes connected with current node (besides those in toVisit array)
        this._edges.forEach(edge => {   // checking for every edge if it starts with the current node   
            if(edge.node1.value === node.value){    
                if(!toVisit.includes(edge.node2) && !visited.includes(edge.node2.value)){   // checking if the new node connected to current node has been visited or is in the toVisit array
                    newToVisit.push(edge.node2) // adding second node from current edge to newToVisit array
                }
            }
        });
        toVisit = newToVisit.concat(toVisit)    // combining newToVisit and ToVisit that way the search is depth-first
        if(toVisit.length === 0){
            return visited  // returning visited if toVisit.length is 0 
        }
        else{
            return this.depthFirstSearch(visited,toVisit,toVisit[0])    // recursivly going to first node from toVisit array
        }
    }

    /**
     * Method to perform a breadth-first search (BFS) on the graph.
     * @param {Array} [visited=[]] - An array to store visited nodes.
     * @param {Array} [toVisit=[]] - An array to store nodes to visit.
     * @param {Node} [node=this._nodes[0]] - The starting node for the search.
     * @returns {Array} The visited nodes in BFS order.
     */
    breadthFirstSearch(visited = [], toVisit = [], node = this._nodes[0]) {
        visited.push(node.value)    // adding current node to visited array
        toVisit.shift() // removing current node from toVisit array
        this._edges.forEach(edge => {   // checking for every edge if it starts with the current node
            if(edge.node1.value === node.value){
                if(!toVisit.includes(edge.node2) && !visited.includes(edge.node2.value)){   // checking if the new node connected to current node has been visited or is in the toVisit array
                    toVisit.push(edge.node2)    // pushing second node from current edge to toVisit array so the search is breadth-first
                }
            }
        });
        if(toVisit.length === 0){
            return visited  // returning visited if toVisit.length is 0
        }
        else{
            return this.breadthFirstSearch(visited,toVisit,toVisit[0])  // recursivly going to first node from toVisit array
        }
    }

    /**
     * Method to perform Dijkstra's algorithm to find the shortest paths from a given node.
     * @param {Node} node - The starting node for Dijkstra's algorithm.
     * @returns {Map} A map containing the shortest distances from the provided node to every other node.
     */
    dijkstra(node) {
        // dijkstra algorithm to calculate the shortest path between two nodes
        const distances = new Map() // initializing new map with every node and distance to that node
        const toVisit = new Set()   // initializing new set with every node that hasn't been visited yet
        toVisit.add(node.value)     // adding initial node to toVisit set
        distances.set(node.value,0) // adding initial node to distances map and giving it 0 as distance
        this._nodes.forEach(n => {  // adding each node to toVisit set and distance map with distance of infinity
            if(node.value !== n.value){
                distances.set(n.value,Infinity)
                toVisit.add(n.value)
            }
        })

        return this.dijkstraAlgorithm(distances, toVisit) // returning default dijkstra algorithm function
    }
    /**
     * Helper method to implement Dijkstra's algorithm.
     * @param {Map} distances - A map containing distances to nodes.
     * @param {Set} toVisit - A set containing nodes to visit.
     * @returns {Map} A map containing the shortest distances from the provided node to every other node.
     */
    dijkstraAlgorithm(distances, toVisit) {
        const nodeValue = findKeyWithLowestValue(distances, toVisit); // Value of current node is the lowest value in distances map that hasn't been visited.

        this._edges.forEach(edge => {
            // Searching for every edge that connects current node with another node and checking if the sum of the cost of that edge and value in distance map is lower than the distance in the distance map.
            if (edge.node1.value === nodeValue && edge.cost + distances.get(nodeValue) < distances.get(edge.node2.value)) {
                distances.set(edge.node2.value, edge.cost + distances.get(nodeValue)); // If it is lower, then the distance in the distance map is replaced by a lower value.
            }
        });

        toVisit.delete(nodeValue); // Removing current node from toVisit set.

        if (toVisit.size === 0) {
            // When all nodes were visited, return distances map as shortest distances between provided node and every other node in the graph.
            return distances;
        } else {
            // Return dijkstraAlgorithm for the next node with the lowest value in the distance map that hasn't been visited.
            return this.dijkstraAlgorithm(distances, toVisit);
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
    breadthFirstSearch_ShortestPath(startingNode, targetNode, currentNode = startingNode, visited = [], toVisit = [], predecessors = new Map()) {
        visited.push(currentNode.value)    // adding current node to visited array
        toVisit.shift() // removing current node from toVisit array
        this._edges.forEach(edge => {   // checking for every edge if it starts with the current node
            if(edge.node1.value === currentNode.value){
                if(!toVisit.includes(edge.node2) && !visited.includes(edge.node2.value)){   // checking if the new node connected to current node has been visited or is in the toVisit array
                    toVisit.push(edge.node2)    // pushing second node from current edge to toVisit array so the search is breadth-first
                    predecessors.set(edge.node2,currentNode); // add second node to predecessors map 
                }
            }
        });
        if(currentNode === targetNode){
            const path = [];
            let step = targetNode;
            while (step !== startingNode) { // recreating the path between starting node and target node
                path.unshift(step);
                step = predecessors.get(step);
            }
            path.unshift(startingNode);
            return path; // returning visited if toVisit.length is 0
        }
        else{
            return this.breadthFirstSearch_ShortestPath(startingNode,targetNode,toVisit[0],visited,toVisit,predecessors)  // recursivly going to first node from toVisit array
        }
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
      if (value < lowestValue && toVisit.has(key)) {
        lowestValue = value;
        lowestKey = key;
      }
    }
  
    return lowestKey;
}

module.exports = { Graph, GraphEdge };