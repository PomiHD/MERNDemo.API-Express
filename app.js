const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

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
