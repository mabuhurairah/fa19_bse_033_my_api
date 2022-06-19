const express = require('express');
const validateFlight = require('../../middlewares/validateFlight');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');
let router = express.Router();
var { Flight } = require("../../models/flight");

//get all flights
router.get("/", async (req,res) => {
    // console.log(req.query);
    console.log(req.user);
    let flights = await Flight.find();
    return res.send(flights);
});

//get single flight
router.get("/:id", auth, admin, async (req,res) => {
    try{
        let flight = await Flight.findById(req.params.id);
        if(!flight){
            return res.status(400).send("Flight with given ID not present"); //when id is not present in db
        }
        return res.send(flight); //when id is ok
    }
    catch(err){
        return res.status(400).send("Invalid ID"); //format of id is invalid or not correct
    }
});

//update a flight
router.put("/:id", validateFlight, auth, admin, async (req,res) => {
    let flight = await Flight.findById(req.params.id);
    flight.flightCompany = req.body.flightCompany;
    flight.flightNumber = req.body.flightNumber;
    flight.departureCity = req.body.departureCity;
    flight.arrivalCity = req.body.arrivalCity;
    flight.departureDate = req.body.departureDate;
    flight.arrivalDate = req.body.arrivalDate;
    flight.passengerCapacity = req.body.passengerCapacity;
    await flight.save();
    return res.send(flight);
});

//delete a flight
router.delete("/:id", auth, admin, async (req,res) => {
    let flight = await Flight.findByIdAndDelete(req.params.id);
    return res.send(flight);
});

//insert a flight
router.post("/", validateFlight, auth, admin, async (req,res) => {
    let flight = new Flight();
    flight.flightCompany = req.body.flightCompany;
    flight.flightNumber = req.body.flightNumber;
    flight.departureCity = req.body.departureCity;
    flight.arrivalCity = req.body.arrivalCity;
    flight.departureDate = req.body.departureDate;
    flight.arrivalDate = req.body.arrivalDate;
    flight.passengerCapacity = req.body.passengerCapacity;
    await flight.save();
    return res.send(flight);
});

module.exports = router;