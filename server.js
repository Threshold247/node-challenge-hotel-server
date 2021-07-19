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
	 return response.status(404).json({msg: "Please complete all fields"});
	}
	//if successful, add the new booking details to booking.json
  bookings.push(newBooking);
  response.json({msg: "booking added",bookings});
});
//read a booking by ID
app.get("/bookings/:id", function(request,response) {
	console.log(request.method,request.originalUrl);
	const id = request.params.id;
	console.log(id);
	const match = bookings.some(  ele => ele.id === parseInt(id));
	console.log(match);
	if(match) {
		 response.json(bookings.find( ({id}) => id === parseInt(id) ));
	}else {
		response.status(404).json({msg: `ID: ${id} Not found`});
	}
	
})




//read all bookings
app.get("/bookings", function(request,response){
  console.log(request.method, request.originalUrl);
  response.json(bookings);
});





const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
