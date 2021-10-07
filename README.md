### Our Application

- Handle CRUD for an item ( we’re are going to use `ticket` )
- Have a standard URL( “http://localhost:7002.com/api/ticket and “http://demo.com/api/ticket/:id” )
- Use the proper HTTP verbs to make it RESTful ( GET, POST, PUT, and DELETE )
- Return JSON data

### Routes

- /api/ticket GET Get all the tickets.
- /api/ticket POST Create a new ticket.
- /api/ticket/{id} GET Get a single ticket.
- /api/ticket/{id} PUT Update a ticket with new info.
- /api/ticket/{id} DELETE Delete a ticket.

### Description

## To run project

- downloade the project folder from github
- go to the mail folder /TicketMangementSystem/
- Install npm modules using command : npm install
- run the project using command : npm start

### swagger documentation

- http://localhost:7002/documentation

### example object to create a ticket
{
  "customerName": "UserX",
  "ticketPrice": 100,
  "performanceTitle": "Avengers",
  "performanceTime": "2021/10/12 02:00:00",
  "creationDate": "2021-09-10" or "2021-09-10T00:00:00"
}