import express from "express";
import {
  createRecipe,
  getSingleRecipe,
  getUserRecipes,
  // removeImage,
  uploadImage,
  updateSingleRecipe,
  searchQuery,
} from "../controller/recipe";
import { verifyJwtToken } from "../middlewares/jwtVerify";
//importing controllers to control routes callback , for maintainable code

//creating router instance like app
const router = express.Router();

//register user endpoint
router.post("/recipe/create", verifyJwtToken, createRecipe);
router.get("/recipe/get/:slug", getSingleRecipe);
router.post("/recipe/update/:slug", verifyJwtToken, updateSingleRecipe);
router.post("/recipe/upload/image", verifyJwtToken, uploadImage);
// router.post("/recipe/remove/image", verifyJwtToken, removeImage);
router.get("/user/recipes", verifyJwtToken, getUserRecipes);
router.post("/search", searchQuery);
module.exports = router;
