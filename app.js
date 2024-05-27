const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-route");

const app = express();

app.use("/api/places", placeRoutes);

app.listen(5000);
