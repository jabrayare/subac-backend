require('dotenv').config()
const express = require( "express");
const mongoose = require("mongoose");
const userRoutes = require("./routers/userRouter.js")

const PORT = process.env.PORT
const CONNECTIONSTRING = process.env.MONGODB_CONNECTION


app = express()
app.use(express.json());

app.use("/", userRoutes);


// Connecting to MongoDB atlas.
mongoose
  .connect(
    CONNECTIONSTRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => {
    console.log("Failed to connect to MongoDB: ", err.message);
    process.exit(1);
  });

app.listen(PORT, ()=> {
    console.log(`Listening on Port ${PORT}`);
})

