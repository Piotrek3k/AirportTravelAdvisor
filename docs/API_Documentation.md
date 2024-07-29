# API documentation

## Content
1. [Description](#description)
2. [Technical requirements](#technical-requirements)
3. [Base URL](#base-url)

## Description

Implementation of airport travel system. System lists available flights between two airports in order of cost or time by using Yen's K-Shortest Paths algorithm.  

## Technical requirements

- Programming language - Javascript
- Server Framework - NodeJS
- Database - MySQL
- Docker

## Base URL

http://localhost:3000

## Endpoint API - Users

### Generate Token

- **URL:** `POST /api/v2/auth/login`
- **Description:** Generate an authentication token for a user.
- **Request Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Responses:**
    - **200 OK:** Successfully generated the token.
        ```json
        {
            "token": "string"
        }
        ```
    - **400 Bad Request:** Invalid request body.
    - **401 Unauthorized:** Authentication failed.

### Create a User

- **URL:** `POST /api/v1/users`
- **Description:** Create a new user.
- **Request Body:**
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string",
    }
    ```
- **Responses:**
    - **201 Created:** Successfully created the user.
    - **401 Unauthorized:** Authorization failed.
    - **400 Bad Request:** Invalid request body.

### Get All Users

- **URL:** `GET /api/v1/users`
- **Description:** Retrieve a list of all users.
- **Responses:**
    - **200 OK:** Successfully retrieved the users.
    - **401 Unauthorized:** Authorization failed.

### Get a User by ID

- **URL:** `GET /api/v1/users/{userId}`
- **Description:** Retrieve a user by ID.
- **Parameters:**
    - **userId:** (string, required) - User's ID
- **Responses:**
    - **200 OK:** Successfully retrieved the user.
        ```json
        {
            "id": 1,
            "username": "string",
            "email": "string",
            "password": "string",
        }
        ```
    - **400 Bad Request:** Invalid user ID.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** User not found.

### Update a User

- **URL:** `PUT /api/v1/users/{userId}`
- **Description:** Update a user's details.
- **Parameters:**
    - **userId:** (string, required) - User's ID
- **Request Body:**
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string",
    }
    ```
- **Responses:**
    - **200 OK:** Successfully updated the user.
    - **400 Bad Request:** Invalid request body.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** User not found.

### Delete a User

- **URL:** `DELETE /api/v1/users/{userId}`
- **Description:** Delete a user by ID.
- **Parameters:**
    - **userId:** (string, required) - User's ID
- **Responses:**
    - **200 OK:** Successfully deleted the user.
    - **400 Bad Request:** Invalid user ID.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** User not found.

### Example Requests

#### Generate Token
Request body: 
```sh
curl -X POST 'api/v2/auth/login' \
-H 'Content-Type: application/json' \
-d '{
    "email": "john.doe@example.com",
    "password": "password123"
}'
```

Response body:
```json
{
    "token": "string"
}
```
#### Create a User

```sh
curl -X POST 'api/v1/users' \
-H 'Authorization: Bearer <token>' \
-H 'Content-Type: application/json' \
-d '{
    "username": "John Doe",
    "email": "john.doe@gmail.com",
    "password": "password123",
}'
```

#### Get all Users
Request body:
```sh
curl -X GET 'api/v1/users' \
-H 'Authorization: Bearer <token>'
```
Response body:
```json
[
    {
        "id": 1,
        "username": "John Doe",
        "email": "john.doe@gmail.com",
        "password": "482c811da5d5b4bc6d497ffa98491e38",
        "createdAt": "2024-07-14 16:03:54.553",
        "updatedAt": "2024-07-24 17:43:53.131"
    },
    {
        "id": 2,
        "username": "JaneDoe123",
        "email": "jane.doe22@gmail.com",
        "password": "cbfdac6008f9cab4083784cbd1874f76618d2a97",
        "createdAt": "2024-07-18 12:35:09.207",
        "updatedAt": "2024-07-24 17:45:13.040"
    }
]

```
#### Get User by ID
Request body:
```sh
curl -X GET 'api/v1/users/1' \
-H 'Authorization: Bearer <token>'

```
Response body:
```json

    {
        "id": 1,
        "code": "JFK",
        "name": "John F. Kennedy International Airport",
        "city": "New York",
        "country": "USA"
    }

```
#### Update a User
```sh
curl -X PUT 'api/v1/users/1' \
-H 'Authorization: Bearer <token>' \
-H 'Content-Type: application/json' \
-d '{
    "username": "JohnDoe2",
    "email": "john.doe@gmail.com",
    "password": "password123",
}'
```
#### Delete a User

```sh
curl -X DELETE 'api/v1/users/1' \
-H 'Authorization: Bearer <token>'


```
## Endpoint API - Airports

### Create an Airport

- **URL:** `POST /api/v1/airports`
- **Description:** Create a new airport.
- **Request Body:**
    ```json
    {
        "code": "string",
        "name": "string",
        "city": "string",
        "country": "string"
    }
    ```
- **Responses:**
    - **201 Created:** Successfully created the airport.
    - **401 Unauthorized:** Authorization failed.
    - **400 Bad Request:** Invalid request body.


### Get Routes Between Two Airports


- **URL:** `GET /api/v1/routes`
- **Description:** Retrieve routes between two airports based on the given criteria.
- **Parameters:**
    - **departure_airport_id:** (int, required) - Departure airport ID
    - **arrival_airport_id:** (int, required) - Arrival airport ID
    - **date:** (string, required) - Date in `YYYY-MM-DD` format
    - **criteria:** (int, required) - Criteria (0, 1, or 2)
- **Request:**
    ```sh
    curl -X GET 'api/v2/routes' \
    -H 'Authorization: Bearer <token>' \
    -G --data-urlencode 'departure_airport_id=1' \
    --data-urlencode 'arrival_airport_id=2' \
    --data-urlencode 'date=2024-07-24' \
    --data-urlencode 'criteria=0'
    ```
- **Responses:**
    - **200 OK:** Successfully retrieved the routes.
        ```json
        [
            {
                "id": 1,
                "flight_number": "MA 0123",
                "airline": "Delta Airlines",
                "departure_airport": "JFK",
                "arrival_airport": "LAX",
                "departure_time": "2024-07-29T10:00:00Z",
                "arrival_time": "2024-07-29T13:00:00Z",
                "cost": 300.00,
            },
            {
                "id": 2,
                "flight_number": "MA 2034",
                "airline": "Delta Airlines",
                "departure_airport": "LAX",
                "arrival_airport": "SFO",
                "departure_time": "2024-07-29T14:00:00Z",
                "arrival_time": "2024-07-29T17:00:00Z",
                "cost": 350.00,
            }
        ]
        ```
    - **400 Bad Request:** Invalid request parameters.
    - **404 Not Found:** No routes found for the given criteria.
### Get All Airports

- **URL:** `GET /api/v1/airports`
- **Description:** Retrieve a list of all airports.
- **Responses:**
    - **200 OK:** Successfully retrieved the airports.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** Airport not found.

### Get an Airport by ID

- **URL:** `GET /api/v1/airports/{airportId}`
- **Description:** Retrieve an airport by ID.
- **Parameters:**
    - **airportId:** (string, required) - Airport's ID
- **Responses:**
    - **200 OK:** Successfully retrieved the airport.
        ```json
        {
            "id": 1,
            "code": "string",
            "name": "string",
            "city": "string",
            "country": "string"
        }
        ```
    - **400 Bad Request:** Invalid airport ID.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** Airport not found.

### Update an Airport

- **URL:** `PUT /api/v1/airports/{airportId}`
- **Description:** Update an airport's details.
- **Parameters:**
    - **airportId:** (string, required) - Airport's ID
- **Request Body:**
    ```json
    {
        "code": "string",
        "name": "string",
        "city": "string",
        "country": "string"
    }
    ```
- **Responses:**
    - **200 OK:** Successfully updated the airport.
    - **400 Bad Request:** Invalid request body.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** Airport not found.

### Delete an Airport

- **URL:** `DELETE /api/v1/airports/{airportId}`
- **Description:** Delete an airport by ID.
- **Parameters:**
    - **airportId:** (string, required) - Airport's ID
- **Responses:**
    - **200 OK:** Successfully deleted the airport.
    - **400 Bad Request:** Invalid airport ID.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** Airport not found.


### Example Requests

#### Create Airport

Request body: 
```sh
curl -X POST 'api/v1/airports' \
-H 'Authorization: Bearer <token>' \
-H 'Content-Type: application/json' \
-d '{
    "code": "JFK",
    "name": "John F. Kennedy International Airport",
    "city": "New York",
    "country": "USA"
}'
```

#### Get all Airports
Request body:
```sh
curl -X GET 'api/v1/airports' \
-H 'Authorization: Bearer <token>'

```
Response body: 
```json
[
    {
        "id": 1,
        "code": "JFK",
        "name": "John F. Kennedy International Airport",
        "city": "New York",
        "country": "USA"
    },
    {
        "id": 2,
        "code": "LAX",
        "name": "Los Angeles International Airport",
        "city": "Los Angeles",
        "country": "USA"
    }
]
```
#### Get Airport by ID
Request body:
```sh
curl -X GET 'api/v1/airports/1' \
-H 'Authorization: Bearer <token>'

```
Response body: 
```json
{
    "id": 1,
    "code": "JFK",
    "name": "John F. Kennedy International Airport",
    "city": "New York",
    "country": "USA"
}

```

#### Update Airport
Request body:
```sh
curl -X PUT 'api/v1/airports/1' \
-H 'Authorization: Bearer <token>' \
-H 'Content-Type: application/json' \
-d '{
    "code": "JFK",
    "name": "John F. Kennedy International Airport",
    "city": "New York",
    "country": "USA"
}'
```

#### Delete Airport
Request body:
```sh
curl -X DELETE 'api/v1/airports/1' \
-H 'Authorization: Bearer <token>'

```


#### Get Routes between two Airports
Request body:
```sh
curl -X GET 'api/v1/routes' \
-H 'Authorization: Bearer <token>' \
-G --data-urlencode 'departure_airport_id=1' \
--data-urlencode 'arrival_airport_id=2' \
--data-urlencode 'date=2024-07-29' \
--data-urlencode 'criteria=1'

```
Response body:
```json
[
            {
                "id": 1,
                "flight_number": "MA 0123",
                "airline": "Delta Airlines",
                "departure_airport": "JFK",
                "arrival_airport": "LAX",
                "departure_time": "2024-07-29T10:00:00Z",
                "arrival_time": "2024-07-29T13:00:00Z",
                "cost": 300.00,
            },
            {
                "id": 2,
                "flight_number": "MA 2034",
                "airline": "Delta Airlines",
                "departure_airport": "LAX",
                "arrival_airport": "SFO",
                "departure_time": "2024-07-29T14:00:00Z",
                "arrival_time": "2024-07-29T17:00:00Z",
                "cost": 350.00,
            }
        ]
```
## Endpoint API - Airports

### Create a Flight

- **URL:** `POST /api/v1/flights`
- **Description:** Create a new flight.
- **Request Body:**
    ```json
    {
        "flight_number": "string",
        "airline": "string",
        "departure_airport_id": 1,
        "arrival_airport_id": 2,
        "cost": 100.00,
        "departure_time": "2024-07-29T10:00:00Z",
        "arrival_time": "2024-07-29T12:00:00Z"
    }
    ```
- **Responses:**
    - **201 Created:** Successfully created the flight.
        ```json
        {
            "flight_id": 1,
            "flight_number": "AA123",
            "airline": "American Airlines",
            "departure_airport_id": 1,
            "arrival_airport_id": 2,
            "cost": 100.00,
            "departure_time": "2024-07-29T10:00:00Z",
            "arrival_time": "2024-07-29T12:00:00Z"
        }
        ```
    - **400 Bad Request:** Invalid request body.
    - **401 Unauthorized:** Authorization failed.

### Get All Flights

- **URL:** `GET /api/v1/flights`
- **Description:** Retrieve a list of all flights.
- **Responses:**
    - **200 OK:** Successfully retrieved the flights.
        ```json
        [
            {
                "flight_id": 1,
                "flight_number": "AA123",
                "airline": "American Airlines",
                "departure_airport_id": 1,
                "arrival_airport_id": 2,
                "cost": 100.00,
                "departure_time": "2024-07-29T10:00:00Z",
                "arrival_time": "2024-07-29T12:00:00Z"
            },
            {
                "flight_id": 2,
                "flight_number": "UA456",
                "airline": "United Airlines",
                "departure_airport_id": 3,
                "arrival_airport_id": 4,
                "cost": 150.00,
                "departure_time": "2024-07-29T14:00:00Z",
                "arrival_time": "2024-07-29T16:00:00Z"
            }
        ]
        ```
    - **401 Unauthorized:** Authorization failed.

### Get a Flight by ID

- **URL:** `GET /api/v1/flights/{flightId}`
- **Description:** Retrieve a flight by ID.
- **Parameters:**
    - **flightId:** (int, required) - Flight's ID
- **Responses:**
    - **200 OK:** Successfully retrieved the flight.
        ```json
        {
            "flight_id": 1,
            "flight_number": "AA123",
            "airline": "American Airlines",
            "departure_airport_id": 1,
            "arrival_airport_id": 2,
            "cost": 100.00,
            "departure_time": "2024-07-29T10:00:00Z",
            "arrival_time": "2024-07-29T12:00:00Z"
        }
        ```
    - **400 Bad Request:** Invalid flight ID.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** Flight not found.

### Update a Flight

- **URL:** `PUT /api/v1/flights/{flightId}`
- **Description:** Update a flight's details.
- **Parameters:**
    - **flightId:** (int, required) - Flight's ID
- **Request Body:**
    ```json
    {
        "flight_number": "string",
        "airline": "string",
        "departure_airport_id": 1,
        "arrival_airport_id": 2,
        "cost": 100.00,
        "departure_time": "2024-07-29T10:00:00Z",
        "arrival_time": "2024-07-29T12:00:00Z"
    }
    ```
- **Responses:**
    - **200 OK:** Successfully updated the flight.
        ```json
        {
            "flight_id": 1,
            "flight_number": "AA123",
            "airline": "American Airlines",
            "departure_airport_id": 1,
            "arrival_airport_id": 2,
            "cost": 100.00,
            "departure_time": "2024-07-29T10:00:00Z",
            "arrival_time": "2024-07-29T12:00:00Z"
        }
        ```
    - **400 Bad Request:** Invalid request body.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** Flight not found.

### Delete a Flight

- **URL:** `DELETE /api/v2/flights/{flightId}`
- **Description:** Delete a flight by ID.
- **Parameters:**
    - **flightId:** (int, required) - Flight's ID
- **Responses:**
    - **200 OK:** Successfully deleted the flight.
    - **400 Bad Request:** Invalid flight ID.
    - **401 Unauthorized:** Authorization failed.
    - **404 Not Found:** Flight not found.

#### Create Flight

Request body: 
```sh
curl -X POST 'api/v1/flights' \
-H 'Authorization: Bearer <token>' \
-H 'Content-Type: application/json' \
-d '{
    "flight_number": "AA123",
    "airline": "American Airlines",
    "departure_airport_id": 1,
    "arrival_airport_id": 2,
    "cost": 100.00,
    "departure_time": "2024-07-29T10:00:00Z",
    "arrival_time": "2024-07-29T12:00:00Z"
}'

```

Response body:
```json
{
    "flight_id": 1,
    "flight_number": "AA123",
    "airline": "American Airlines",
    "departure_airport_id": 1,
    "arrival_airport_id": 2,
    "cost": 100.00,
    "departure_time": "2024-07-29T10:00:00Z",
    "arrival_time": "2024-07-29T12:00:00Z"
}

```

#### Get all Flights

Request body: 
```sh
curl -X GET 'api/v1/flights' \
-H 'Authorization: Bearer <token>'

```

Response body:
```json
[
    {
        "flight_id": 1,
        "flight_number": "AA123",
        "airline": "American Airlines",
        "departure_airport_id": 1,
        "arrival_airport_id": 2,
        "cost": 100.00,
        "departure_time": "2024-07-29T10:00:00Z",
        "arrival_time": "2024-07-29T12:00:00Z"
    },
    {
        "flight_id": 2,
        "flight_number": "UA456",
        "airline": "United Airlines",
        "departure_airport_id": 3,
        "arrival_airport_id": 4,
        "cost": 150.00,
        "departure_time": "2024-07-29T14:00:00Z",
        "arrival_time": "2024-07-29T16:00:00Z"
    }
]

```
#### Get Flight by ID

Request body: 
```sh
curl -X GET 'api/v1/flights/1' \
-H 'Authorization: Bearer <token>'

```

Response body:
```json
{
    "flight_id": 1,
    "flight_number": "AA123",
    "airline": "American Airlines",
    "departure_airport_id": 1,
    "arrival_airport_id": 2,
    "cost": 100.00,
    "departure_time": "2024-07-29T10:00:00Z",
    "arrival_time": "2024-07-29T12:00:00Z"
}

```

#### Update Flight

Request body: 
```sh
curl -X PUT 'api/v2/flights/1' \
-H 'Authorization: Bearer <token>' \
-H 'Content-Type: application/json' \
-d '{
    "flight_number": "AA123",
    "airline": "American Airlines",
    "departure_airport_id": 1,
    "arrival_airport_id": 2,
    "cost": 100.00,
    "departure_time": "2024-07-29T10:00:00Z",
    "arrival_time": "2024-07-29T13:00:00Z"
}'

```
Response body: 
```json
{
    "flight_id": 1,
    "flight_number": "AA123",
    "airline": "American Airlines",
    "departure_airport_id": 1,
    "arrival_airport_id": 2,
    "cost": 100.00,
    "departure_time": "2024-07-29T10:00:00Z",
    "arrival_time": "2024-07-29T13:00:00Z"
}
```

#### Delete Flight
Request body:
```sh
curl -X DELETE 'api/v2/flights/1' \
-H 'Authorization: Bearer <token>'
```