import express from "express";
import cors from "cors";
const morgan = require("morgan");
require("dotenv").config();
import { readdirSync } from "fs";
import mongoose from "mongoose";

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors());
app.use(morgan("tiny"));

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

//db connect with atlas/localdb by mongoose
mongoose
  .connect(process.env.DB)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

//** Listening Port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
