# RESTfulAPI
Task given to create a Rest API for event management

![](https://github.com/nunopontes06/RESTfulAPI/blob/d004e24ed680f59aa5b8f2f4e84b28419d01b7cc/RESTful%20API.JPG)

# Task Description
Query all events: sends a request to the server and presents it to the user
all events currently available on the system. For each event must be
presented: number, description, the person responsible (name and contacts), the capacity and the
number of seats still available.

• Query event: query a specific event by indicating a
valid event number showing the number, description, the person responsible (name and
contacts), the capacity and the number of places still available.
• Make a reservation: the user must indicate a valid event number, the number of places required and the person responsible (name and contact details) for the reservation.
• When a reservation request is received, the server must verify that the event number is valid, and that the requested places are still available. If so, the registration creation date is registered, and a unique booking confirmation code is generated, which is returned to the customer (along with the other booking details). Otherwise, an error message will be returned.
• Consult reservation: the user must indicate a valid event number and a valid reservation confirmation code, in relation to an existing reservation in the system. If both values are valid, the server must present the data of this reservation in the system.
• Change reservation: the user must indicate a valid event number and a valid reservation confirmation code, in relation to an existing reservation in the system. If both values are valid, the server must change the data for this reservation in the system.
• Cancel reservation: the user must indicate a valid event number and a valid reservation confirmation code, in relation to an existing reservation in the system. If both values are valid, the server must indicate to proceed with the elimination of this reservation from the system.
• Detail event: allows you to consult the details of a certain event, by indicating a valid event number, showing the event data, and also showing the data of each reservation for that event.
• Change event: allows the user to change the data for a specific event, by indicating a valid event number.
• Delete event: allows the user to delete a specific event, by indicating a valid event number. When an event is deleted, all information relating to that event will be lost.
In relation to the basic features presented, one should also consider:
User registration - Restrict access to event management only to users registered on the platform, and non-registered users can only consult all events, consult an event, make, consult, change and cancel a reservation.

Make a reservation - in the case where there is not enough space for the number of places to reserve, you can reserve space only for the available places, and the remaining reservation places will be on the waiting list. In case there is any cancellation, these places are considered (they are automatically booked)
Payments: Cost for booking the event (per seat); include data for the nif…
Booking status: on hold, on payment, confirmed
Associate a classification system for TAGS events, enabling the search by TAG.
Geolocation: Search for nearby events, ie within a certain radius
Image: possibility to provide an image of the event.
