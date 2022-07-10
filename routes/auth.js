import express from "express";
import { loginUser, registerUser } from "../controller/auth";
//importing controllers to control routes callback , for maintainable code

//creating router instance like app
const router = express.Router();

//register user endpoint
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
