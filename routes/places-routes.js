const express = require("express");

const HttpError = require("../models/http-error");
const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10118",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    creator: "u1",
  },
];
router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    // different way to throw an error, this is for sync code
    throw new HttpError("Could not find a place for the provided id.", 404); // This will be caught in the error handling middleware
  }
  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((place) => place.creator === userId);
  if (!place) {
    // different way to throw an error, this is for async code
    return next(
      new HttpError("Could not find a place for the provided user id.", 404),
    ); // This will be caught in the error handling middleware
  }
  res.json({ place });
});

module.exports = router;
