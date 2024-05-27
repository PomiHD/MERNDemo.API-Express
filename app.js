const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-route");

const app = express();

app.use("/api/places", placeRoutes);

app.use((error, req, res, next) => {
  // If the response has already been sent, forward the error to the next middleware
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
