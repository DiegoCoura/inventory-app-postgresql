const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const storeRouter = require("./routes/storeRouter");

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});

app.use("/", storeRouter);

// Throw error if get here
app.use(function (req, res, next) {
  //   res.send("hello World");
  const error = new Error("Not found");
  error.status = 404;

  return next(error);
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});
