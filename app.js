const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-routes");

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

// Additional error handling middleware
app.use((error, req, res, next) => {
  // Log the error or do something else with it here
  console.error(error);
  res.end();
});

app.listen(5000);
