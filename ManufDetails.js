const mongoose = require("mongoose");

const ImageDetailsScehma = new mongoose.Schema(
  {
    from: String,
    toPlace: String,
    quantity: Number,
    pickup: String,
    transporter: String,
  },
  {
    collection: "ManufDetails",
  }
);

mongoose.model("ManufDetails", ImageDetailsScehma);
