const express = require("express");
const { check } = require("express-validator");

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
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

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace,
);

router.patch(
  "/:pid",
  [
    check("title").optional().not().isEmpty(),
    check("description").optional().isLength({ min: 5 }),
  ],
  updatePlace,
);

router.delete("/:pid", deletePlace);

module.exports = router;
