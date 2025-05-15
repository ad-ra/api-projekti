GENERAL

Author: Ada-Sofia Rannelma <ada.rannelma@tuni.fi>

Date: 26.3.2025

DESCRIPTION

This is a Node.js-based RESTful API for managing a database of people, their homes, and pets.
The application provides a comprehensive set of endpoints
to create, read, update, and delete records for the main entities.

INSTALL

To set up the project
1. clone the repository
2. ensure that Node.js is installed
3. install required dependencies:

npm install express sqlite3 dotenv

4. setup the database (instructions in the sql directory README)

create a .env file in the project directory and define the database.db path and server port
PORT=8000
DATABASE=database.db

USAGE

To start the server:

node server.js


API DESCRIPTION

Person Endpoints

POST /api/v1/person – Add a new person
GET /api/v1/person – Fetch all persons with associated pets and homes
GET /api/v1/person/search?fname=John&lname=Doe – Search for a person by first and last name
GET /api/v1/person/:id – Get a person by ID
PUT /api/v1/person/:id – Update a person’s details
DELETE /api/v1/person/:id – Delete a person

Pet & Home Endpoints

GET /api/v1/pet – Fetch all pets
GET /api/v1/home – Fetch all homes

API EXAMPLES

## GET

curl --silent --include -X GET "http://localhost:8000/api/v1/home/"

curl --silent --include -X GET "http://localhost:8000/api/v1/person/"

curl --silent --include -X GET "http://localhost:8000/api/v1/pet/"

curl --silent --include -X GET "http://localhost:8000/api/v1/person/search?fname=Emma"

curl --silent --include -X GET "http://localhost:8000/api/v1/person/search?fname=Jane&lname=Smith&petname=Veksi&homecity=Turku"

curl --silent --include -X GET "http://localhost:8000/api/v1/person/4"

## POST

curl --silent --include -X POST http://localhost:8000/api/v1/person \
  -H "Content-Type: application/json" \
  -d '{
    	"fname": "Elliot",
    	"lname": "Notebook",
    	"phone": "555-13234",
    	"email": "elliot.notebook@example.com",
    	"salary": 6000,
    	"job": "Actor",
    	"birth": "2004-07-19",
    	"homeaddress": "Brahenkatu 13",
	"homezip": "20100"
  }'


curl --silent --include -X POST http://localhost:8000/api/v1/person \
  -H "Content-Type: application/json" \
  -d '{
    	"fname": "Sarah",
    	"lname": "Notebook",
    	"phone": "555-13244",
    	"email": "sarah.notebook@example.com",
    	"salary": 0,
    	"job": "Student",
    	"birth": "2006-07-19",
    	"homeaddress": "Brahenkatu 13",
	"homezip": "20100"
  }'

curl --silent --include --request POST "http://localhost:8000/api/v1/home" \
     --header "Content-Type: application/json" \
     --data '{
	"address": "Hämeenkatu 12",
       	"city": "Tampere",
       	"region": "Pirkanmaa",
       "zipcode": "33710"
     }'

curl --silent --include --request POST "http://localhost:8000/api/v1/pet" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": 3,
    "birthday": "2022-03-01",
    "weight": 30.5,
    "specialneeds": "None",
    "owneremail": "elliot.notebook@example.com"
  }'


## UPDATE

curl --silent --include -X PUT http://localhost:8000/api/v1/person/4 \
  -H "Content-Type: application/json" \
  -d '{
    	"fname": "Bob",
    	"lname": "Williams",
    	"phone": "+542 1341351",
    	"email": "bob.w@example.com",
    	"salary": 4500,
    	"job": "Elementary School Teacher",
    	"birth": "2004-07-14",
    	"homeaddress": "Brahenkatu 13",
	"homezip": "20100"
  }'

curl --silent --include -X PUT http://localhost:8000/api/v1/home/1 \
     -H "Content-Type: application/json" \
     -d '{
       "address": "Kasarmikatu 113",
       "city": "Helsinki",
       "region": "Uusimaa",
       "zipcode": "00100"
     }'

curl --silent --include -X PUT http://localhost:8000/api/v1/pet/4 \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Tweety",
       "type": "Bird",
       "breed": "Canary",
       "age": 6,
       "birthday": "2019-03-15",
       "weight": 28,
       "specialneeds": "Needs a bath once a month",
       "owneremail": "matti@example.com"
     }'

## DELETE

curl --silent --include -X DELETE http://localhost:8000/api/v1/person/1

curl --silent --include -X DELETE http://localhost:8000/api/v1/pet/5

curl --silent --include -X DELETE http://localhost:8000/api/v1/home/2
