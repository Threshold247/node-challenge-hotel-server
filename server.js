const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// create bookings
app.post("/bookings", function (request,response) {
  console.log(request.method,request.originalUrl);
  //logic:  setup variable with key-value pairs
  const newBooking = {
    id: request.body.id,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate
  };
	//logic: check each key-pair is added otherwise log an error
	if(!newBooking.id || !newBooking.title || !newBooking.firstName || ! !newBooking.surname || !newBooking.email || !newBooking.roomId || !newBooking.checkInDate || !newBooking.checkOutDate) {
	 return response.status(400).json({msg: "Please complete all fields"});
	}
	//if successful, add the new booking details to booking.json
  bookings.push(newBooking);
  response.json({msg: "booking added",bookings});
});


//search for a guest by date BE CAREFUL OF HIERARCHY

app.get("/bookings/search", function(request, response) {
  console.log(request.method, request.originalUrl);
  const searchDate = request.query.date;
  console.log(searchDate);
  const result = bookings.some(ele => ele.checkInDate === searchDate || ele.checkOutDate === searchDate);
  console.log(result);

  if(result){
	 response.json(bookings.filter(ele => ele.checkInDate === searchDate || ele.checkOutDate === searchDate));
  } else {
	  response.status(404).json({msg: `Guest not found`});
  }


});



//read all bookings
app.get("/bookings", function(request,response){
  console.log(request.method, request.originalUrl);
  response.json(bookings);
});

//read a booking by ID
app.get("/bookings/:id", function(request,response) {
	console.log(request.method,request.originalUrl);
	const id = request.params.id;
	const match = bookings.some( ele => ele.id === parseInt(id) );

	if(match) {
		 response.json(bookings.filter( ele => ele.id === parseInt(id) ));
	} else {
		response.status(404).json({msg: `ID: ${id} not found`});
	}

});
//update a booking ID
app.put("/bookings/:id", function(request,response) {
	console.log(request.method,request.originalUrl);

	const id = request.params.id
	const match = bookings.some(el => el.id === parseInt(id));

	if(match) {
		const updateGuest = request.body;
		bookings.forEach(el => {
			if(el.id === parseInt(id)) {
				el.id = updateGuest.id ? updateGuest.id : el.id;
				el.title = updateGuest.title ? updateGuest.title : el.title;
				el.firstName = updateGuest.firstName ? updateGuest.firstName : el.firstName;
				el.surname = updateGuest.surname ? updateGuest.surname : el.surname;
				el.email = updateGuest.email ? updateGuest.email : el.email;
				el.roomId = updateGuest.roomId ? updateGuest.roomId : el.roomId;
				el.checkInDate = updateGuest.checkInDate ? updateGuest.checkInDate : el.checkInDate;
				el.checkOutDate = updateGuest.checkOutDate ? updateGuest.checkOutDate : el.checkOutDate;

				response.json({msg: `Updated Guest:${id}`, el})
			}
			})
	} else {
		response.status(404).json({msg: `Guest: ${id} not found`});
	}


});


//delete a booking by ID
app.delete("/bookings/:id", function(request,response) {
	console.log(request.method,request.originalUrl);
	const id = request.params.id;
	const match = bookings.some(  ele => ele.id === parseInt(id) );

	if(match) {
		 response.json({msg: `Booking ${id} removed`,
		 bookings: bookings.filter( ele => ele.id !== parseInt(id) )});
	} else {
		response.status(404).json({msg: `ID: ${id} Not found`});
	}

});






const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
