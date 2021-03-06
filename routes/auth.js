import express from "express";
import { loginUser, registerUser } from "../controller/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
