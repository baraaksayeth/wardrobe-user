const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

// DB Connection
const { db_url, options } = require("./config/db");

// Import the router
const productRoute = require("./routes/product-route");
const categoryRoute = require("./routes/category-route");
const userRoute = require("./routes/user-route");
const orderRoute = require("./routes/order-route");

const app = express();
const PORT = process.env.PORT || 8080;

// Set Middlewares
app.use(bodyParser.json()); // Parser every request body to json
app.use(helmet()); // Manage http headers respons
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Authorization, Content-Type"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  next();
});

// Set Routes
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.code || 500);
  res.json({ message: err.message || "An Unknown Error!" });
});

// Run Database and server
mongoose
  .connect(db_url, options)
  .then(() => app.listen(PORT, () => console.log(`Server Running in ${PORT}`)))
  .catch((err) => console.log(err));
