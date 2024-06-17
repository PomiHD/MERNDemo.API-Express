const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place", 404),
    ); // This will be caught in the error handling middleware
  }

  if (!place) {
    //   // different way to throw an error, this is for sync code
    //   throw new HttpError("Could not find a place for the provided id.", 404); // This will be caught in the error handling middleware
    return next(
      new HttpError("Could not find a place for the provided id.", 404),
    ); // This will be caught in the error handling middleware
  }
  res.json({ place: place.toObject({ getters: true }) }); // toObject() is a mongoose method to convert the document to a plain JS object
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500,
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404),
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true }),
    ),
  });
};
// alternative ways
// function getPlaceById() {...}
// const getPlaceById = function() {...}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    image:
      "https://lh3.googleusercontent.com/p/AF1QipPIzh6fpHvFALWSVqS4RNF4h__GviXD6b80n01d=s680-w680-h510",
    address,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator); // exclude password
  } catch (err) {
    return next(
      new HttpError("Creating place failed, please try again later.", 500),
    );
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }
  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess }); // This will not save the place to the database, but it will add it to the session
    user.places.push(createdPlace); // Mongoose will automatically extract the id from the place object and then store it in the user.places array
    await user.save({ session: sess }); // This will not save the user to the database, but it will add it to the session
    await sess.commitTransaction(); // This will save the session to the database, which will save the place and the user to the database
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500,
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422),
    );
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place.", 500),
    );
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update place.", 500),
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete place.", 500),
    );
  }

  if (!place) {
    return next(new HttpError("Could not find place for this id.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.findByIdAndDelete(placeId, { session: sess });
    place.creator.places.pull(place); // Mongoose will automatically remove the id from the user.places array
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete place.", 500),
    );
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
