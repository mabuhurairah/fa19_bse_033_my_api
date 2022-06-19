var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var flightSchema = mongoose.Schema({
    flightCompany:String,
    flightNumber:String,
    departureCity:String,
    arrivalCity:String,
    departureDate:Date,
    arrivalDate:Date,
    passengerCapacity:Number,
});

var Flight = mongoose.model("Flight", flightSchema);

function validateFlight(data) {
    const schema = Joi.object({
        flightCompany: Joi.string().min(3).max(20).required(),
        flightNumber: Joi.string().min(3).max(20).required(),
        departureCity: Joi.string().min(3).max(20).required(),
        arrivalCity: Joi.string().min(3).max(20).required(),
        departureDate: Joi.string().min(3).max(50).required(),
        arrivalDate: Joi.string().min(3).max(50).required(),
        passengerCapacity: Joi.number().min(0).required(),
    });
    return schema.validate(data, { abortEarly: false });
}

module.exports.Flight = Flight;
module.exports.validate = validateFlight;