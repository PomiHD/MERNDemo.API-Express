const express = require("express");

const {
  getPlaceById,
  getPlacesByUserId,
} = require("../controllers/places-controllers");

const router = express.Router();

/**
 * @route   GET api/places/:pid
 * @desc    Get place by id
 */
router.get("/:pid", getPlaceById);

/**
 * @route   GET api/places/user/:uid
 * @desc    Get place by user id
 */
router.get("/user/:uid", getPlacesByUserId);

module.exports = router;
