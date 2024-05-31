const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    // different way to throw an error, this is for sync code
    throw new HttpError("Could not find a place for the provided id.", 404); // This will be caught in the error handling middleware
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (!places || places.length === 0) {
    // different way to throw an error, this is for async code
    return next(
      new HttpError("Could not find places for the provided user id.", 404),
    ); // This will be caught in the error handling middleware
  }
  res.json({ places });
};
// alternative ways
// function getPlaceById() {...}
// const getPlaceById = function() {...}

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); // ideally, should be stored in a database
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === placeId),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  if (placeIndex !== -1) {
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({ place: DUMMY_PLACES[placeIndex] });
  } else {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
