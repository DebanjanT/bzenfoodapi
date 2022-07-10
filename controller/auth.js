import BzUser from "../models/user";
import { hashPassword, comparePassword } from "../utils/bcrypt";
const jwt = require("jsonwebtoken");

export const registerUser = async (req, res) => {
  try {
    const { email, name, password, full_name } = req.body;
    if (!email || !name || !password) {
      return res.status(400).send("Credentials missing");
    }
    if (password.length < 6) return res.status(400).send("Too short password");
    //check existing user
    const extuser = await BzUser.findOne({ email });
    if (extuser) return res.status(400).send("User exists with same email");
    const newUser = new BzUser({
      email,
      name,

      password: await hashPassword(password),
    });
    await newUser.save();
    return res.json({
      newUser,
    });
  } catch (er) {
    console.log(er);
    return res.status(400).send("Server error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((email == "") | !email)
      return res.status(400).send("Email is required");
    if ((password == "") | !password)
      return res.status(400).send("Password is required");
    const bzuser = await BzUser.findOne({ email }).exec();
    if (!bzuser) return res.status(400).send("Email is not registered");
    const isMatch = await comparePassword(password, bzuser.password);
    if (!isMatch) return res.status(400).send("Invalid password");
    const User = await BzUser.findOne({ email })
      .select("-password")

      .exec();
    const accessToken = jwt.sign({ _id: bzuser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res.json({
      data: {
        User,
        accessToken,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Server error");
  }
};
