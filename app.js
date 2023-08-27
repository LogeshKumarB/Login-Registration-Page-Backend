const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const mongoUrl = "mongodb://127.0.0.1:27017/qkart";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./ManufDetails");

const User = mongoose.model("UserInfo");
const Manuf = mongoose.model("ImageDetails");
app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      Name,
      email,
      address,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});
app.post("/manufacturing", async (req, res) => {
  const { from, toPlace, quantity, pickup, transporter } = req.body;
  try {
    await Manuf.create({
      from,
      toPlace,
      quantity,
      pickup,
      transporter,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { email: user.email },
      {
        expiresIn: "30m",
      }
    );

    if (res.status(201)) {
      return res.json({
        status: "ok",
        data: token,
        userType: user.userType,
        address: user.address,
      });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

app.listen(5000, () => {
  console.log("Server Started");
});

app.get("/getAllDetails", async (req, res) => {
  try {
    const allDetails = await Manuf.find({});
    res.send({ status: "ok", data: allDetails });
  } catch (error) {
    console.log(error);
  }
});
